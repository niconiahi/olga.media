import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DB } from "db/types";
import { Form, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { dedupe, getRaws } from "~/utils/cut";

const videosSchema = z.array(
  z.object({
    hash: z.string(),
    show: z.string(),
    title: z.string(),
  }),
);

const cutsSchema = z.array(
  z.object({
    start: z.string(),
    label: z.string(),
    videoId: z.number(),
  }),
);

export type Cuts = z.infer<typeof cutsSchema>;

function getShow(title: string): string {
  const regex = /(Ser[ií]a\sIncre[ií]ble|So[ñn]é?\sQue\sVolaba)/g;
  const matches = title.match(regex);

  if (!matches) {
    throw new Error('the "title" should contain the "show" name');
  }

  return matches[0];
}

export async function getCuts(hash: string, videoId: number) {
  const url = `https://www.youtube.com/watch?v=${hash}`;
  const res = await fetch(url);
  const html = await res.text();
  const raws = getRaws(html, videoId);
  const result = cutsSchema.safeParse(raws);
  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const cuts = result.data;
  return dedupe(cuts);
}

export const useAddCuts = routeAction$(
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
          show: getShow(title),
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
      .values(
        videos.map(({ hash, title, show }) => ({
          title,
          hash,
          day,
          month,
          show,
        })),
      )
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
        cuts.map(({ label, start, videoId }) => ({
          label,
          start,
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
  const inputRef = useSignal<HTMLInputElement>();
  const action = useAddCuts();

  useVisibleTask$(() => {
    if (!inputRef.value) return;

    inputRef.value.focus();
  });

  return (
    <section class="flex h-full flex-1 flex-col items-center justify-center space-y-2">
      <Form action={action} class="w-80 space-y-2">
        <p class="flex flex-col space-y-1">
          <label class="mabry leading-none text-brand-blue" for="day">
            Dia
          </label>
          <input
            // eslint-disable-next-line prettier/prettier
            class="mabry border-2 border-brand-blue px-1 py-3 text-brand-blue outline-4 md:hover:bg-brand-blueHover focus-visible:outline focus-visible:outline-brand-red"
            type="number"
            ref={inputRef}
            id="day"
            name="day"
          />
        </p>
        <p class="flex flex-col space-y-1">
          <label class="mabry leading-none text-brand-blue" for="month">
            Mes
          </label>
          <input
            // eslint-disable-next-line prettier/prettier
            class="mabry border-2 border-brand-blue px-1 py-3 text-brand-blue outline-4 md:hover:bg-brand-blueHover focus-visible:outline focus-visible:outline-brand-red"
            type="number"
            id="month"
            name="month"
          />
        </p>
        <button
          type="submit"
          class="mabry w-full border-2 border-brand-red bg-brand-red px-4 py-2 text-2xl text-brand-stone outline-4 focus-visible:outline focus-visible:outline-brand-blue md:hover:bg-brand-stone md:hover:text-brand-red"
        >
          Agregar
        </button>
      </Form>
    </section>
  );
});
