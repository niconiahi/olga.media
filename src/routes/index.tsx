import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import type { DB } from "db/types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

export const useList = routeLoader$(async ({ platform }) => {
  const env = platform.env as { DB: D1Database };
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: env.DB }),
  });

  return await db
    .selectFrom("cut")
    .innerJoin("video", "video.id", "cut.video_id")
    .select(["video.hash", "cut.label", "cut.start"])
    .execute();
});

export default component$(() => {
  const list = useList();

  return (
    <main>
      <h1 class="text-6xl text-brand-blue">Cortes</h1>
      <ul>
        {Array.from(list.value).map(({ label, start, hash }) => (
          <li key={`youtube_link_${label}`}>
            <a
              class="text-brand-red hover:cursor-pointer hover:underline"
              href={`https://www.youtube.com/watch?v=${hash}` + "&t=" + start}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Olga TV",
  meta: [
    {
      name: "description",
      content: "Stream art",
    },
  ],
};
