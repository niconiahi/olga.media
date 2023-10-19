import { component$ } from "@builder.io/qwik";
import type { DB } from "db/types";
import { Form, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

const videosSchema = z.array(
  z.object({
    title: z.string(),
    hash: z.string(),
  }),
);

export const useAddDay = routeAction$(
  async ({ day, month }, { platform, fail, status }) => {
    const env = platform.env as { DB: D1Database };
    const db = new Kysely<DB>({
      dialect: new D1Dialect({ database: env.DB }),
    });
    const res = await fetch(
      `https://www.youtube.com/@olgaenvivo_/search?query=${day}%2F${month}`,
    );
    const html = await res.text();
    const regex = /"videoId":"([^"]*?)".*?"text":"((?:[^"\\]|\\.)*)"/g;
    const raws = [] as unknown[];

    let match;
    while ((match = regex.exec(html)) !== null) {
      const [, hash, title] = match;

      if (title.includes(`${day}/${month}`)) {
        raws.push({
          hash,
          title,
        });
      }
    }

    const result = videosSchema.safeParse(raws);
    if (!result.success) {
      throw new Error(result.error.toString());
    }

    const videos = result.data;
    const prevVideos = await db
      .selectFrom("video")
      .select(["hash"])
      .where((eb) => eb.or(videos.map(({ hash }) => eb("hash", "=", hash))))
      .execute();

    const insertions = result.data.filter(
      ({ hash }) => !prevVideos.some((prevVideo) => prevVideo.hash === hash),
    );
    if (insertions.length === 0) {
      return fail(409, []);
    }

    await db
      .insertInto("video")
      .values(insertions.map(({ hash, title }) => ({ title, hash })))
      .execute();

    status(201);
    return db
      .selectFrom("video")
      .select(["title"])
      .where((eb) => eb.or(insertions.map(({ hash }) => eb("hash", "=", hash))))
      .execute();
  },
  zod$({
    day: z.coerce.number(),
    month: z.coerce.number(),
  }),
);

export default component$(() => {
  const action = useAddDay();

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
      {action.value && action.value.length > 0 ? (
        <ul>
          {action.value.map(({ title }) => (
            <li key={`video_${title}`}>{title}</li>
          ))}
        </ul>
      ) : null}
      {action.status && action.status === 409 ? (
        <h1>Todos los videos de este dia fueron agregados</h1>
      ) : null}
    </main>
  );
});
