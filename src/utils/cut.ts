import type { Cuts } from "~/routes/add";

function getSafeStart(start: string) {
  const pieces = start.replaceAll("\\n", "").split(":");

  return pieces
    .map((digit, i) => {
      if (pieces.length === 3 && i === 0) {
        return digit;
      }

      if (pieces.length === 2 && i === 0) {
        return digit.padStart(2, "0");
      }

      return digit.padEnd(2, "0");
    })
    .join(":");
}

export function getRaws(html: string, videoId: number): unknown[] {
  const raws = [] as unknown[];
  const regex =
    /(\\n\d{1,2}:\d{2}(?::\d{1,2})?)\s(.*?)(?=\\n\d{1,2}:\d{2}(?::\d{1,2})?|\\n\\n|$)/g;

  let match;
  while ((match = regex.exec(html)) !== null) {
    const [, start, label] = match;
    raws.push({
      start: getSafeStart(start),
      label: label.trim().replaceAll("\\", ""),
      videoId,
    });
  }

  return raws;
}

export function dedupe(cuts: Cuts) {
  const { start } = cuts[0];
  const index = cuts.slice(1, cuts.length).findIndex((cut) => {
    return cut.start === start;
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
