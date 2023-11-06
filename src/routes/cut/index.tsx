import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  zod$,
  Form,
  routeAction$,
  z,
} from "@builder.io/qwik-city";
import clsx from "clsx";
import type { Cuts } from "~/routes/cut/get/all";
import { cutsSchema } from "~/routes/cut/get/all";
import { getUser } from "~/utils/session";
import { upvotesSchema, type Upvotes } from "~/routes/upvote/get/all";
import { upvoteSchema } from "~/routes/upvote/create/[id]";
import { getDb } from "~/utils/db";
import { SeriaIncreibleIcon } from "~/icons/seria-increible";
import { SoneQueVolabaIcon } from "~/icons/sone-que-volaba";
import { getSeconds } from "~/utils/cut";
import { HeartIcon } from "~/icons/heart";

export const useUserId = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.platform);
  const user = await getUser(requestEvent, db);

  return { userId: user?.userId };
});

export const useCuts = routeLoader$(async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const query = searchParams.get("query");
  const raws = await (await fetch(url.origin + "/cut/get/all")).json();
  const result = cutsSchema.safeParse(raws);
  if (!result.success) {
    throw new Error(result.error.toString());
  }
  const cuts = result.data;
  const cutsByDay = Object.entries(
    cuts
      .filter((cut) => {
        return query
          ? cut.label
              .toLocaleLowerCase()
              .replaceAll("á", "a")
              .replaceAll("é", "e")
              .replaceAll("í", "i")
              .replaceAll("ó", "o")
              .replaceAll("ú", "u")
              .includes(
                query
                  .toLocaleLowerCase()
                  .replaceAll("á", "a")
                  .replaceAll("é", "e")
                  .replaceAll("í", "i")
                  .replaceAll("ó", "o")
                  .replaceAll("ú", "u"),
              )
          : true;
      })
      .reduce<{
        [day: string]: { [show: string]: Cuts };
      }>((prevDays, cut) => {
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

  return { cutsByDay, query };
});

export const useUpvotes = routeLoader$(async (requestEvent) => {
  const { request, platform } = requestEvent;
  const url = new URL(request.url);
  const db = getDb(platform);
  const user = await getUser(requestEvent, db);

  if (!user?.userId) {
    return [] as Upvotes;
  }

  const raws = await (
    await fetch(url.origin + "/upvote/get/all" + `?userId=${user.userId}`)
  ).json();
  const result = upvotesSchema.safeParse(raws);
  if (!result.success) {
    throw new Error(result.error.toString());
  }
  const upvotes = result.data;

  return upvotes;
});

export const useSearch = routeAction$(
  async ({ query }, { redirect }) => {
    throw redirect(302, query === "" ? "/" : `/?query=${query}`);
  },
  zod$({
    query: z.string(),
  }),
);

export const useUpvote = routeAction$(
  async ({ isUpvoted, userId, cutId }, { redirect, request, error }) => {
    if (!userId) {
      throw redirect(302, `/login`);
    }

    const url = new URL(request.url);

    if (isUpvoted === "true") {
      const data = await (
        await fetch(url.origin + "/upvote/remove/[id]", {
          method: "DELETE",
          body: JSON.stringify({ userId, cutId }),
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      const result = upvoteSchema.safeParse(data);
      if (!result.success) {
        throw error(
          404,
          `the expected structure of the removed "upvote" is incorrect`,
        );
      }
      const upvote = result.data;

      return upvote;
    } else {
      const data = await (
        await fetch(url.origin + "/upvote/create/[id]", {
          method: "POST",
          body: JSON.stringify({ userId, cutId }),
        })
      ).json();
      const result = upvoteSchema.safeParse(data);
      if (!result.success) {
        throw error(
          404,
          `the expected structure of the created "upvote" is incorrect`,
        );
      }
      const upvote = result.data;

      return upvote;
    }
  },
  zod$({
    cutId: z.string(),
    isUpvoted: z.union([z.literal("true"), z.literal("false")]),
    userId: z.union([z.coerce.string(), z.undefined()]),
  }),
);

export default component$(() => {
  const cuts = useCuts();
  const search = useSearch();
  const upvote = useUpvote();
  const userId = useUserId();
  const upvotes = useUpvotes();

  return (
    <>
      <section>
        <Form
          reloadDocument
          class="flex w-full items-center justify-between border-2 border-brand-red"
          action={search}
        >
          <p class="w-full px-2">
            <label for="query" class="sr-only">
              Buscar por titulo
            </label>
            <input
              value={cuts.value.query}
              class="mabry w-full px-1 text-brand-blue outline-4 focus-visible:outline focus-visible:outline-brand-blue md:hover:bg-brand-redHover"
              type="text"
              id="query"
              name="query"
            />
          </p>
          <button
            class="mabry border-l-2 border-brand-red bg-brand-stone px-4 py-2 text-2xl text-brand-red outline-4 outline-offset-0 transition-colors duration-100 focus-visible:border-l-0 focus-visible:outline focus-visible:outline-brand-blue md:hover:bg-brand-red md:hover:text-brand-stone"
            type="submit"
          >
            Buscar
          </button>
        </Form>
      </section>
      <section class="mt-2 flex">
        <ul class="grow space-y-2">
          {cuts.value.cutsByDay
            .slice()
            .reverse()
            .map(([day, cuts], index) => (
              <li key={`day-${day}`} class="space-y-2">
                <h4
                  class={clsx([
                    "bebas text-3xl uppercase leading-none text-brand-red",
                    index > 0 ? "mt-3" : "mt-0",
                  ])}
                >
                  {day}
                </h4>
                <ul class="space-y-3">
                  {Object.entries(cuts).map(([_show, cuts]) => {
                    const show = _show.toLocaleLowerCase().includes("volaba")
                      ? "sone-que-volaba"
                      : "seria-increible";

                    return (
                      <li
                        key={`show-${day}-${show}`}
                        class={clsx([
                          "mr-0.5 space-y-2 border-2 p-2",
                          show === "sone-que-volaba"
                            ? "border-show-soneQueVolaba-blue shadow-soneQueVolaba"
                            : "border-show-seriaIncreible-purple shadow-seriaIncreible",
                        ])}
                      >
                        {show === "seria-increible" ? (
                          <SeriaIncreibleIcon />
                        ) : null}
                        {show === "sone-que-volaba" ? (
                          <SoneQueVolabaIcon />
                        ) : null}
                        <ul>
                          {cuts
                            .map((cut) => {
                              return {
                                ...cut,
                                isUpvoted: upvotes.value.some(
                                  ({ cut_id }) => cut_id === cut.id,
                                ),
                              };
                            })
                            .map(({ label, start, hash, id, isUpvoted }) => {
                              return (
                                <li
                                  key={`cut-${day}-${show}-${hash}`}
                                  class="flex items-center space-x-2 py-0.5"
                                >
                                  <a
                                    class={clsx([
                                      "flex w-full items-center justify-between space-x-2 px-0.5 font-medium md:hover:cursor-pointer",
                                      show === "sone-que-volaba"
                                        ? "outline-4 focus-visible:outline focus-visible:outline-show-soneQueVolaba-blue md:hover:bg-show-soneQueVolaba-blueHover"
                                        : "outline-4 focus-visible:outline focus-visible:outline-show-seriaIncreible-purple md:hover:bg-show-seriaIncreible-purpleHover",
                                    ])}
                                    target="_blank"
                                    href={
                                      `https://www.youtube.com/watch?v=${hash}` +
                                      "&t=" +
                                      getSeconds(start)
                                    }
                                  >
                                    <span
                                      class={clsx([
                                        "mabry",
                                        show === "sone-que-volaba"
                                          ? "text-show-soneQueVolaba-blue"
                                          : "text-show-seriaIncreible-purple",
                                      ])}
                                    >
                                      {label}
                                    </span>
                                    <span class="mabry text-brand-red">
                                      {start}
                                    </span>
                                  </a>
                                  <Form action={upvote} class="flex">
                                    <span class="sr-only">
                                      {isUpvoted
                                        ? "Quitar voto de este corte"
                                        : "Votar este corte para el ranking"}
                                    </span>
                                    <input
                                      type="hidden"
                                      name="isUpvoted"
                                      value={isUpvoted ? "true" : "false"}
                                    />
                                    <input
                                      type="hidden"
                                      name="cutId"
                                      value={id}
                                    />
                                    <input
                                      type="hidden"
                                      name="userId"
                                      value={userId.value.userId}
                                    />
                                    <button
                                      type="submit"
                                      class="outline-4 focus-visible:outline focus-visible:outline-brand-red"
                                      aria-label={
                                        isUpvoted
                                          ? "Quitar voto de este corte"
                                          : "Votar este corte para el ranking"
                                      }
                                      aria-pressed={isUpvoted}
                                    >
                                      <HeartIcon
                                        class={clsx([
                                          "h-6 w-7",
                                          isUpvoted
                                            ? "fill-brand-redHover text-brand-red"
                                            : "fill-brand-stone text-brand-redHover",
                                        ])}
                                      />
                                    </button>
                                  </Form>
                                </li>
                              );
                            })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
        </ul>
      </section>
    </>
  );
});
