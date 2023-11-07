import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DB } from "db/types";
import { Form, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import clsx from "clsx";
import type { Cuts } from "~/utils/cut";
import { getCuts } from "~/utils/cut";
import { getVideos } from "~/utils/video";

export const useAddCuts = routeAction$(
  async ({ day, month }, { platform, fail, status }) => {
    const env = platform.env as { DB: D1Database };
    const db = new Kysely<DB>({
      dialect: new D1Dialect({ database: env.DB }),
    });
    const result = await getVideos(day, month);
    if (!result.success) {
      return fail(400, { success: false, error: result.error.toString() });
    }
    const nextVideos = result.data;
    if (nextVideos.length === 0) {
      return fail(409, {
        success: false,
        error: "No se encontraron videos en este dia",
      });
    }
    const prevVideos = await db
      .selectFrom("video")
      .select(["hash"])
      .where((eb) => eb.or(nextVideos.map(({ hash }) => eb("hash", "=", hash))))
      .execute();

    const videos = nextVideos.filter(
      ({ hash }) => !prevVideos.some((prevVideo) => prevVideo.hash === hash),
    );
    if (videos.length === 0) {
      return fail(409, {
        success: false,
        error: "Los videos de este dia ya fueron agregados",
      });
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

    // safely casting as I'm parsing with the schema library before adding items to it
    const cuts: Cuts = [];
    for (const { hash, id } of addedVideos) {
      const result = await getCuts(hash, id);
      if (!result.success) {
        return fail(400, { success: false, error: result.error.toString() });
      }
      const cuts = result.data;

      for (const cut of cuts) {
        cuts.push(cut);
      }
    }

    const CHUNK_SIZE = 20;
    for (let i = 0; i < cuts.length; i += CHUNK_SIZE) {
      const chunk = cuts.slice(i, i + CHUNK_SIZE);

      await db
        .insertInto("cut")
        .values(
          chunk.map(({ label, start, videoId }) => ({
            label,
            start,
            video_id: videoId,
          })),
        )
        .execute();
    }

    status(201);
    return { success: true, addedVideos };
  },
  zod$({
    day: z.coerce.number(),
    month: z.coerce.number(),
  }),
);

export default component$(() => {
  const inputRef = useSignal<HTMLInputElement>();
  const addCuts = useAddCuts();

  useVisibleTask$(() => {
    if (!inputRef.value) return;

    inputRef.value.focus();
  });

  return (
    <section class="flex h-full flex-1 flex-col items-center justify-center space-y-2">
      <Form action={addCuts} class="w-80 space-y-2">
        <p class="flex flex-col space-y-1">
          <label class="mabry leading-none text-brand-blue" for="day">
            Dia
          </label>
          <input
            class="mabry border-2 border-brand-blue bg-brand-stone px-1 py-3 text-brand-blue outline-4 focus-visible:outline focus-visible:outline-brand-red md:hover:bg-brand-blueHover"
            type="number"
            ref={inputRef}
            id="day"
            name="day"
            aria-invalid={addCuts.value?.error ? "true" : undefined}
            aria-errormessage="day-error"
          />
          <span
            id="day-error"
            class={clsx([
              "mabry text-brand-red underline decoration-brand-blue decoration-dotted decoration-2 underline-offset-1",
              addCuts.value?.error ? "visible" : "invisible",
            ])}
          >
            {addCuts.value?.error ?? "Olga"}
          </span>
        </p>
        <p class="flex flex-col space-y-1">
          <label class="mabry leading-none text-brand-blue" for="month">
            Mes
          </label>
          <input
            class="mabry border-2 border-brand-blue bg-brand-stone px-1 py-3 text-brand-blue outline-4 focus-visible:outline focus-visible:outline-brand-red md:hover:bg-brand-blueHover"
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
        {addCuts.value &&
        addCuts.value.success === true &&
        addCuts.value.addedVideos &&
        addCuts.value.addedVideos.length > 0 ? (
          <ul>
            {addCuts.value.addedVideos.map(({ title }) => (
              <li key={`video_${title}`}>{title}</li>
            ))}
          </ul>
        ) : null}
      </Form>
    </section>
  );
});
