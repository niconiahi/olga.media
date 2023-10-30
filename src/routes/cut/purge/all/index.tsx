import { z, type RequestHandler } from "@builder.io/qwik-city";

export const cutsSchema = z.array(
  z.object({
    start: z.string(),
    label: z.string(),
    day: z.number(),
    hash: z.string(),
    month: z.number(),
    show: z.string(),
  }),
);

export type Cuts = z.infer<typeof cutsSchema>;

export const onGet: RequestHandler = async ({ json }) => {
  const CLOUDFLARE_PURGE_URL =
    "https://api.cloudflare.com/client/v4/zones/identifier/purge_cache";
  const OLGA_URL = "https://olga-tv.pages.dev";

  const data = await (
    await fetch(CLOUDFLARE_PURGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prefixes: [`${OLGA_URL}/cut/get/all`],
      }),
    })
  ).json();

  json(200, data.success);
};
