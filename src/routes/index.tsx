import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import type { D1Database } from "@cloudflare/workers-types";
import type { DB } from "db/types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

// the "start" comes in the form of "dd:dd:dd"
function getSeconds(start: string) {
  const parts = start.split(":").map(Number);

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

export const useList = routeLoader$(async ({ platform }) => {
  const env = platform.env as { DB: D1Database };
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: env.DB }),
  });

  const cuts = await db
    .selectFrom("cut")
    .innerJoin("video", "video.id", "cut.video_id")
    .select([
      "video.day",
      "video.hash",
      "video.show",
      "video.month",
      "cut.label",
      "cut.start",
    ])
    .execute();

  const cutsByDay = Object.entries(
    cuts.reduce<{
      [id: string]: {
        [show: string]: {
          label: string;
          start: string;
          day: number;
          hash: string;
          month: number;
        }[];
      };
    }>((prevDays, cut) => {
      console.log("useList ~ prevDays:", prevDays);
      const day = `${cut.day}/${cut.month}`;
      const { show } = cut;
      return {
        ...prevDays,
        [day]: prevDays[day]
          ? {
              ...prevDays[day],
              [show]: prevDays[day][show]
                ? [...prevDays[day][show], cut]
                : [cut],
            }
          : {
              [show]: [cut],
            },
      };
    }, {}),
  );

  console.log("useList ~ cutsByDay:", cutsByDay);

  return cutsByDay;
});

export default component$(() => {
  const list = useList();

  return (
    <main>
      <h1 class="text-6xl text-brand-blue">Cortes</h1>
      <ul>
        {list.value.map(([day, cut]) => (
          <li>
            <h1>{day}</h1>
            <ul>
              {Object.entries(cut).map(([show, cuts]) => (
                <li>
                  <h1>{show}</h1>
                  {cuts.map(({ label, start, hash }) => (
                    <li key={`youtube_link_${label}`} class="space-x-2">
                      <a
                        class="text-brand-red hover:cursor-pointer hover:underline"
                        href={
                          `https://www.youtube.com/watch?v=${hash}` +
                          "&t=" +
                          getSeconds(start)
                        }
                      >
                        {label}
                      </a>
                      <span class="text-brand-blue">{start}</span>
                    </li>
                  ))}
                </li>
              ))}
              {/* {Object.entries(cut).map(([show, { label, start, hash }]) => (
                <li key={`youtube_link_${label}`} class="space-x-2">
                  <a
                    class="text-brand-red hover:cursor-pointer hover:underline"
                    href={
                      `https://www.youtube.com/watch?v=${hash}` +
                      "&t=" +
                      getSeconds(start)
                    }
                  >
                    {label}
                  </a>
                  <span class="text-brand-blue">{start}</span>
                </li>
              ))} */}
            </ul>
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
