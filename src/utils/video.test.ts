import { test, expect, describe } from "vitest";
import type { Videos } from "~/utils/video";
import { getVideos } from "~/utils/video";

describe("getVideos", () => {
  test("should correctly get the list from the video of 21/9", async () => {
    const day = 12;
    const month = 10;
    const result = await getVideos(day, month);
    if (!result.success) {
      throw new Error(result.error.toString());
    }
    const videos = result.data;
    expect(videos).toStrictEqual([
      {
        hash: "A2HPLsdnm6s",
        show: "sone-que-volaba",
        title: `CONCURSO de ERUCTOS y GALA de DESPEDIDA de GIME ACCARDI | Soñé Que Volaba | COMPLETO 12/10`,
      },
      {
        hash: "f2rdkeeshZU",
        show: "seria-increible",
        title: `HOMERO "REDISTRIBUYE las RIQUEZAS" y cómo NO bailar SAMBA | Sería Increíble | COMPLETO 12/10`,
      },
    ] as Videos);
  });
});
