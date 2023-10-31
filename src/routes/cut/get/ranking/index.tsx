import { z, type RequestHandler } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import type { DB } from "db/types";
import { Kysely, sql } from "kysely";
import { D1Dialect } from "kysely-d1";

export const cutsSchema = z.array(
  z.object({
    start: z.string(),
    label: z.string(),
    day: z.number(),
    hash: z.string(),
    month: z.number(),
    show: z.string(),
    upvotes: z.number(),
  }),
);

export type Cuts = z.infer<typeof cutsSchema>;

export const onGet: RequestHandler = async ({ json, platform }) => {
  const env = platform.env as { DB: D1Database };
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: env.DB }),
  });
  const cuts = await db
    .selectFrom("cut")
    .innerJoin("video", "video.id", "cut.video_id")
    .leftJoin("upvote", "upvote.id", "cut.id")
    .select([
      "video.day",
      "video.hash",
      "video.show",
      "video.month",
      "cut.label",
      "cut.start",
      sql<number>`COUNT(upvote.id)`.as("upvotes"),
    ])
    .groupBy("cut.id")
    .orderBy("upvotes", "desc")
    .limit(20)
    .execute();

  json(200, cuts);
};
