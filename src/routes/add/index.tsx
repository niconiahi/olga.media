import { component$ } from "@builder.io/qwik";
import type { DB } from "db/types";
import { Form, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

const videosSchema = z.array(
  z.object({
    hash: z.string(),
    title: z.string(),
  }),
);

const cutsSchema = z.array(
  z.object({
    time: z.string(),
    label: z.string(),
    videoId: z.number(),
  }),
);

// the "time" comes in the form of "dd:dd:dd"
function getSeconds(time: string) {
  const parts = time.split(":").map(Number);

  let seconds = 0;
  if (parts.length === 3) {
    seconds += parts[0] * 3600;
    seconds += parts[1] * 60;
    seconds += parts[2];
  } else if (parts.length === 2) {
    seconds += parts[0] * 60;
    seconds += parts[1];
  } else if (parts.length === 1) {
    seconds = parts[0];
  }

  return seconds;
}

export async function getCuts(hash: string, videoId: number) {
  const url = `https://www.youtube.com/watch?v=${hash}`;
  const res = await fetch(url);
  const html = await res.text();
  const regex = /(\d+:\d{2}(?::\d{2})?) (.*?)(?=\\n|$)/g;
  const raws = [] as unknown[];

  let match;
  while ((match = regex.exec(html)) !== null) {
    const [, time, label] = match;
    raws.push({
      time,
      label,
      videoId,
    });
  }

  const result = cutsSchema.safeParse(raws);
  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const cuts = result.data;
  // the list repeats over and over, so we find the index of the second start
  const index = cuts
    .slice(1, cuts.length)
    .findIndex(
      (element) => element.time === "0:00" || element.time === "00:00",
    );

  // and we cut it there
  return cuts.slice(0, index + 1);
}

export const useAddCutsy = routeAction$(
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

    const nextVideos = result.data;
    const prevVideos = await db
      .selectFrom("video")
      .select(["hash"])
      .where((eb) => eb.or(nextVideos.map(({ hash }) => eb("hash", "=", hash))))
      .execute();

    const videos = nextVideos.filter(
      ({ hash }) => !prevVideos.some((prevVideo) => prevVideo.hash === hash),
    );
    if (videos.length === 0) {
      return fail(409, []);
    }

    await db
      .insertInto("video")
      .values(videos.map(({ hash, title }) => ({ title, hash, day, month })))
      .execute();

    const addedVideos = await db
      .selectFrom("video")
      .select(["title", "id", "hash"])
      .where((eb) => eb.or(videos.map(({ hash }) => eb("hash", "=", hash))))
      .execute();

    const cuts = (
      await Promise.all(addedVideos.map(({ hash, id }) => getCuts(hash, id)))
    ).flat();

    await db
      .insertInto("cut")
      .values(
        cuts.map(({ label, time, videoId }) => ({
          label,
          start: getSeconds(time),
          video_id: videoId,
        })),
      )
      .execute();

    status(201);
    return addedVideos;
  },
  zod$({
    day: z.coerce.number(),
    month: z.coerce.number(),
  }),
);

export default component$(() => {
  const action = useAddCutsy();

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
