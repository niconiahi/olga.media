import { z, type RequestHandler } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import type { DB } from "db/types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

const upvoteSchema = z.object({
  cutId: z.coerce.number(),
  userId: z.string(),
});
export const upvotesSchema = z.array(
  z.object({
    start: z.string(),
    label: z.string(),
    day: z.number(),
    hash: z.string(),
    month: z.number(),
    show: z.string(),
  }),
);

export type Upvotes = z.infer<typeof upvotesSchema>;

export const onDelete: RequestHandler = async ({
  json,
  platform,
  request,
  error,
}) => {
  const data = await request.json();
  const result = upvoteSchema.safeParse(data);
  if (!result.success) {
    throw error(400, result.error.toString());
  }
  const { cutId, userId } = result.data;
  const env = platform.env as { DB: D1Database };
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: env.DB }),
  });

  const upvote = await db
    .selectFrom("upvote")
    .select("id")
    .where("cut_id", "=", cutId)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!upvote?.id) {
    throw error(
      400,
      `there is no "upvote" that matches the one requested to delete. Please check the values of "cutId" and "userId"`,
    );
  }

  await db.deleteFrom("upvote").where("id", "=", upvote.id).executeTakeFirst();

  json(200, upvote);
};
