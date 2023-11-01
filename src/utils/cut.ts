import type { Cuts } from "~/routes/add";

export function getRaws(html: string, videoId: number): unknown[] {
  const raws = [] as unknown[];
  const regex =
    /(\\n\d{1,2}:\d{2}(?::\d{2})?)\s(.*?)(?=\\n\d{1,2}:\d{2}(?::\d{2})?|\\n\\n|$)/g;

  let match;
  while ((match = regex.exec(html)) !== null) {
    const [, start, label] = match;
    raws.push({
      start: start.replaceAll("\\n", ""),
      label: label.trim().replaceAll("\\", ""),
      videoId,
    });
  }

  return raws;
}

export function dedupe(cuts: Cuts) {
  const index = cuts.slice(1, cuts.length).findIndex((element) => {
    const regex = /^0{1,2}:\d{1,2}$/;

    return regex.test(element.start);
  });

  return cuts.slice(0, index + 1);
}
