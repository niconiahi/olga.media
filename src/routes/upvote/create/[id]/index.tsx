import { z, type RequestHandler } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import type { DB } from "db/types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

const bodySchema = z.object({
  cutId: z.coerce.number(),
  userId: z.string(),
});
export const upvoteSchema = z.object({
  id: z.number(),
});
export const upvotesSchema = z.array(
  z.object({
    start: z.string(),
    label: z.string(),
    date: z.string(),
    hash: z.string(),
    show: z.string(),
  }),
);

export type Upvotes = z.infer<typeof upvotesSchema>;

export const onPost: RequestHandler = async ({
  json,
  platform,
  request,
  error,
}) => {
  const data = await request.json();
  const result = bodySchema.safeParse(data);
  if (!result.success) {
    throw error(404, result.error.toString());
  }
  const { cutId, userId } = result.data;
  const env = platform.env as { DB: D1Database };
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: env.DB }),
  });
  const { insertId } = await db
    .insertInto("upvote")
    .values({
      cut_id: cutId,
      user_id: userId,
    })
    .executeTakeFirst();

  if (!insertId) {
    throw error(400, `an error occurred while creating an "upvote"`);
  }

  const upvote = await db
    .selectFrom("upvote")
    .select("id")
    .where("id", "=", Number(insertId))
    .executeTakeFirst();

  if (!upvote) {
    throw error(400, `an error occurred while creating an "upvote"`);
  }

  json(200, upvote);
};
