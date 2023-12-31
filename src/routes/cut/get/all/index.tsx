import { z, type RequestHandler } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import type { DB } from "db/types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

export const cutsSchema = z.array(
  z.object({
    id: z.number(),
    start: z.string(),
    label: z.string(),
    hash: z.string(),
    date: z.string(),
    show: z.string(),
  }),
);

export type Cuts = z.infer<typeof cutsSchema>;

export const onGet: RequestHandler = async ({
  json,
  platform,
  cacheControl,
}) => {
  const env = platform.env as { DB: D1Database };
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: env.DB }),
  });
  const cuts = await db
    .selectFrom("cut")
    .innerJoin("video", "video.id", "cut.video_id")
    .select([
      "video.date",
      "video.hash",
      "video.show",
      "cut.id",
      "cut.label",
      "cut.start",
    ])
    .execute();

  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    sMaxAge: 60 * 5,
  });
  json(200, cuts);
};
