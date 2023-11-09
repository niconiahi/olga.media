import { z, type RequestHandler } from "@builder.io/qwik-city";
import { PRODUCTION_ORIGIN } from "~/utils/routes";

export const cutsSchema = z.array(
  z.object({
    start: z.string(),
    label: z.string(),
    hash: z.string(),
    date: z.string(),
    show: z.string(),
  }),
);

export type Cuts = z.infer<typeof cutsSchema>;

export const onGet: RequestHandler = async ({ json }) => {
  const CLOUDFLARE_PURGE_URL =
    "https://api.cloudflare.com/client/v4/zones/identifier/purge_cache";

  const data = await (
    await fetch(CLOUDFLARE_PURGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prefixes: [`${PRODUCTION_ORIGIN}/cut/get/all`],
      }),
    })
  ).json();

  json(200, data.success);
};
