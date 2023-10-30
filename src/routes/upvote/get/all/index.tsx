import { z, type RequestHandler } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import type { DB } from "db/types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

const userIdSchema = z.string();
export const upvotesSchema = z.array(
  z.object({
    cut_id: z.number(),
    id: z.number(),
    user_id: z.string(),
  }),
);

export type Upvotes = z.infer<typeof upvotesSchema>;

export const onGet: RequestHandler = async ({ json, platform, request }) => {
  const url = new URL(request.url);
  const result = userIdSchema.safeParse(url.searchParams.get("userId"));
  if (!result.success) {
    throw new Error(result.error.toString());
  }
  const userId = result.data;
  const env = platform.env as { DB: D1Database };
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: env.DB }),
  });
  const upvotes = await db
    .selectFrom("upvote")
    .selectAll()
    .where("user_id", "=", userId)
    .execute();

  json(200, upvotes);
};
