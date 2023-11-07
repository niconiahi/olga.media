import { z } from "@builder.io/qwik-city";

export const showSchema = z.union([
  z.literal("sone-que-volaba"),
  z.literal("seria-increible"),
]);

export type Show = z.infer<typeof showSchema>;

const videosSchema = z.array(
  z.object({
    hash: z.string().min(1, "The hash is required"),
    show: showSchema,
    title: z.string().min(1, "The title is required"),
  }),
);

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

export async function getVideos(day: number, month: number) {
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
  return videosSchema.safeParse(raws);
}
