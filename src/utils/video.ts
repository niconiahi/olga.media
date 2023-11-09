import { z } from "@builder.io/qwik-city";

export const showSchema = z.union([
  z.literal("sone-que-volaba"),
  z.literal("seria-increible"),
]);

export type Show = z.infer<typeof showSchema>;

export const videosSchema = z.array(
  z.object({
    hash: z.string().min(1, "The hash is required"),
    show: showSchema,
    title: z.string().min(1, "The title is required"),
  }),
);

export type Videos = z.infer<typeof videosSchema>;

export function getShow(title: string): string {
  const regex = /(ser[ií]a\sincre[ií]ble|so[ñn][eé]?\sque\svolaba)/g;
  const matches = title.toLocaleLowerCase().match(regex);

  if (!matches) {
    throw new Error('the "title" should contain the "show" name');
  }

  return matches[0].toLocaleLowerCase().includes("volaba")
    ? "sone-que-volaba"
    : "seria-increible";
}

export async function getRaws(html: string, day: number, month: number) {
  const regex = /"videoId":"([^"]*?)".*?"text":"((?:[^"\\]|\\.)*)"/g;
  const raws = [] as unknown[];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const [, hash, title] = match;
    if (title.includes(`${day}/${month}`)) {
      raws.push({
        hash,
        title: title.trim().replaceAll("\\", ""),
        show: getShow(title),
      });
    }
  }
  return raws;
}

export async function getVideos(day: number, month: number) {
  const url = `https://www.youtube.com/@olgaenvivo_/search?query=${day}%2F${month}`;
  const res = await fetch(url);
  const html = await res.text();
  const raws = await getRaws(html, day, month);
  return videosSchema.safeParse(raws);
}
