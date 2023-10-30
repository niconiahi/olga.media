import { z, type RequestHandler } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import type { DB } from "db/types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

const cutsSchema = z.array(
  z.object({
    start: z.string(),
    label: z.string(),
    day: z.number(),
    hash: z.string(),
    month: z.number(),
    show: z.string(),
  }),
);

export type Cuts = z.infer<typeof cutsSchema>;

const userIdSchema = z.string();

export const onGet: RequestHandler = async ({
  json,
  platform,
  request,
  cacheControl,
}) => {
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
  const cuts = await db
    .selectFrom("upvote")
    .select("upvote.cut_id")
    .where("user_id", "=", userId)
    .execute();

  cacheControl({
    // TODO: set real value, this is for testing purposes
    staleWhileRevalidate: 60,
  });
  json(200, cuts);
};
