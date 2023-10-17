import { component$ } from "@builder.io/qwik";
import type { DB } from "db/types";
import { Form, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

const videoSchema = z.array(
  z.object({
    title: z.string(),
    hash: z.string(),
  }),
);

export const useVideos = routeAction$(
  async ({ day, month }, { platform }) => {
    const env = platform.env as { DB: D1Database };
    const db = new Kysely<DB>({
      dialect: new D1Dialect({ database: env.DB }),
    });
    const res = await fetch(
      `https://www.youtube.com/@olgaenvivo_/search?query=${day}%2F${month}`,
    );
    const html = await res.text();
    const regex = /"videoId":"([^"]*?)".*?"text":"((?:[^"\\]|\\.)*)"/g;
    const videos = [] as unknown[];

    let match;
    while ((match = regex.exec(html)) !== null) {
      const [hash, title] = match;

      if (title.includes(`${day}/${month}`)) {
        videos.push({
          hash,
          title,
        });
      }
    }

    const additions = videoSchema.safeParse(videos);

    if (!additions.success) {
      throw new Error(additions.error.toString());
    }

    await db
      .insertInto("video")
      .values(additions.data.map(({ hash, title }) => ({ title, hash })))
      .execute();

    return db
      .selectFrom("video")
      .select(["title"])
      .where((eb) =>
        eb.or(additions.data.map(({ hash }) => eb("hash", "=", hash))),
      )
      .execute();
  },
  zod$({
    day: z.coerce.number(),
    month: z.coerce.number(),
  }),
);

export default component$(() => {
  const action = useVideos();

  return (
    <main>
      <Form action={action}>
        <p>
          <label for="day">Dia</label>
          <input name="day" id="day" type="number" />
        </p>
        <p>
          <label for="month">Mes</label>
          <input name="month" id="month" type="number" />
        </p>
        <button type="submit">Agregar videos</button>
      </Form>
      {action.value ? (
        <ul>
          {action.value.map(({ title }) => (
            <li key={`video_${title}`}>{title}</li>
          ))}
        </ul>
      ) : null}
    </main>
  );
});
