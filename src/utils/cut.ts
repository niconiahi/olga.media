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

// the "start" comes in the form of "dd:dd:dd"
export function getSeconds(start: string) {
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
