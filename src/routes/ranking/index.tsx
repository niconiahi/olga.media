import { component$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { Cuts } from "~/routes/cut/get/ranking";
import { cutsSchema } from "~/routes/cut/get/ranking";
import clsx from "clsx";
import { SeriaIncreibleIcon } from "~/icons/seria-increible";
import { SoneQueVolabaIcon } from "~/icons/sone-que-volaba";
import { getSeconds } from "~/utils/cut";
import { getShow, showSchema } from "~/utils/video";

const cutsByShowSchema = z.array(z.tuple([showSchema, cutsSchema]));

export const useCuts = routeLoader$(async ({ request, error }) => {
  const url = new URL(request.url);
  const raws = await (await fetch(url.origin + "/cut/get/ranking")).json();
  const result = cutsSchema.safeParse(raws);
  if (!result.success) {
    throw new Error(result.error.toString());
  }
  const cuts = result.data;
  const cutsByShow = Object.entries(
    cuts.reduce<{ [show: string]: Cuts }>((prevShows, cut) => {
      const { show: _show } = cut;
      const show = getShow(_show);

      return {
        ...prevShows,
        [show]: prevShows[show] ? [...prevShows[show], cut] : [cut],
      };
    }, {}),
  );

  const _result = cutsByShowSchema.safeParse(cutsByShow);
  if (!_result.success) {
    throw error(400, _result.error.toString());
  }

  return { cutsByShow: _result.data };
});

export default component$(() => {
  const cuts = useCuts();

  return (
    <section class="flex h-full flex-1 flex-col items-start justify-center space-y-2">
      <h2 class="bebas text-3xl uppercase leading-none text-brand-red">
        Top 20
      </h2>
      <ul class="w-full grow space-y-2">
        {cuts.value.cutsByShow.map(([show, cuts]) => {
          return (
            <li
              key={`show-${show}`}
              class={clsx([
                "mr-0.5 space-y-2 border-2 p-2",
                show === "sone-que-volaba"
                  ? "border-show-soneQueVolaba-blue shadow-soneQueVolaba"
                  : "border-show-seriaIncreible-purple shadow-seriaIncreible",
              ])}
            >
              {show === "seria-increible" ? <SeriaIncreibleIcon /> : null}
              {show === "sone-que-volaba" ? <SoneQueVolabaIcon /> : null}
              <ul>
                {cuts.map(({ label, start, hash, upvotes }) => {
                  return (
                    <li
                      key={`cut-${show}-${hash}`}
                      class="flex items-start py-0.5"
                    >
                      <a
                        class={clsx([
                          "flex w-full items-start justify-between space-x-2 px-0.5 font-medium md:hover:cursor-pointer",
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
                      </a>
                      <div class="flex items-center justify-end">
                        <span class="mabry min-w-fit px-1 text-brand-blue">
                          {Array.from(String(upvotes)).map((number) => (
                            <span
                              aria-hidden="true"
                              class={clsx([
                                "mabry border-2 border-b-4 border-solid px-1 py-0.5",
                                show === "sone-que-volaba"
                                  ? "border-show-soneQueVolaba-blue text-show-soneQueVolaba-blue"
                                  : "border-show-seriaIncreible-purple text-show-seriaIncreible-purple",
                              ])}
                            >
                              {number}
                            </span>
                          ))}
                          <span class="sr-only">{upvotes} votos</span>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
});
