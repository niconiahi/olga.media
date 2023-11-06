import { test, expect, describe } from "vitest";
import type { Cuts } from "~/routes/add";
import { dedupe, getRaws } from "~/utils/cut";

describe("getRaws", () => {
  test("should correctly get the list from the video of 21/9", async () => {
    const hash = "30bcG4mLRNA";
    const url = `https://www.youtube.com/watch?v=${hash}`;
    const res = await fetch(url);
    const html = await res.text();
    const videoId = 1;
    const raws = getRaws(html, videoId);
    expect(raws).toStrictEqual([
      { start: "00:00", label: "Extrañamos Argentina", videoId: 1 },
      { start: "00:40", label: "Goni líder en gastronomía", videoId: 1 },
      { start: "02:28", label: "Llegó el agüita", videoId: 1 },
      { start: "06:09", label: "La nota que se vieneee", videoId: 1 },
      { start: "07:20", label: "Famosos que fueron a ver a Messi", videoId: 1 },
      { start: "11:55", label: "La canción del beso", videoId: 1 },
      { start: "12:28", label: "Gracias todos", videoId: 1 },
      { start: "13:50", label: "Saluditos y se vieenee", videoId: 1 },
      { start: "20:50", label: "Goni es un pillín", videoId: 1 },
      { start: "24:30", label: '"Voy a la casa de Messi"', videoId: 1 },
      { start: "29:50", label: "Momento soy la disco", videoId: 1 },
      { start: "39:48", label: "ENTREVISTA A MESSI", videoId: 1 },
      { start: "1:16:47", label: "EMOCIONADOS", videoId: 1 },
      {
        start: "1:26:23",
        label: "Repercusiones a la nota de la vida",
        videoId: 1,
      },
      { start: "1:50:00", label: "GRACIAS", videoId: 1 },
      { start: "00:00", label: "Extrañamos Argentina", videoId: 1 },
      { start: "00:40", label: "Goni líder en gastronomía", videoId: 1 },
      { start: "02:28", label: "Llegó el agüita", videoId: 1 },
      { start: "06:09", label: "La nota que se vieneee", videoId: 1 },
      { start: "07:20", label: "Famosos que fueron a ver a Messi", videoId: 1 },
      { start: "11:55", label: "La canción del beso", videoId: 1 },
      { start: "12:28", label: "Gracias todos", videoId: 1 },
      { start: "13:50", label: "Saluditos y se vieenee", videoId: 1 },
      { start: "20:50", label: "Goni es un pillín", videoId: 1 },
      { start: "24:30", label: '"Voy a la casa de Messi"', videoId: 1 },
      { start: "29:50", label: "Momento soy la disco", videoId: 1 },
      { start: "39:48", label: "ENTREVISTA A MESSI", videoId: 1 },
      { start: "1:16:47", label: "EMOCIONADOS", videoId: 1 },
      {
        start: "1:26:23",
        label: "Repercusiones a la nota de la vida",
        videoId: 1,
      },
      { start: "1:50:00", label: "GRACIAS", videoId: 1 },
      { start: "00:00", label: "Extrañamos Argentina", videoId: 1 },
      { start: "00:40", label: "Goni líder en gastronomía", videoId: 1 },
      { start: "02:28", label: "Llegó el agüita", videoId: 1 },
      { start: "06:09", label: "La nota que se vieneee", videoId: 1 },
      { start: "07:20", label: "Famosos que fueron a ver a Messi", videoId: 1 },
      { start: "11:55", label: "La canción del beso", videoId: 1 },
      { start: "12:28", label: "Gracias todos", videoId: 1 },
      { start: "13:50", label: "Saluditos y se vieenee", videoId: 1 },
      { start: "20:50", label: "Goni es un pillín", videoId: 1 },
      { start: "24:30", label: '"Voy a la casa de Messi"', videoId: 1 },
      { start: "29:50", label: "Momento soy la disco", videoId: 1 },
      { start: "39:48", label: "ENTREVISTA A MESSI", videoId: 1 },
      { start: "1:16:47", label: "EMOCIONADOS", videoId: 1 },
      {
        start: "1:26:23",
        label: "Repercusiones a la nota de la vida",
        videoId: 1,
      },
      { start: "1:50:00", label: "GRACIAS", videoId: 1 },
      { start: "00:00", label: "Extrañamos Argentina", videoId: 1 },
      { start: "00:40", label: "Goni líder en gastronomía", videoId: 1 },
      { start: "02:28", label: "Llegó el agüita", videoId: 1 },
      { start: "06:09", label: "La nota que se vieneee", videoId: 1 },
      { start: "07:20", label: "Famosos que fueron a ver a Messi", videoId: 1 },
      { start: "11:55", label: "La canción del beso", videoId: 1 },
      { start: "12:28", label: "Gracias todos", videoId: 1 },
      { start: "13:50", label: "Saluditos y se vieenee", videoId: 1 },
      { start: "20:50", label: "Goni es un pillín", videoId: 1 },
      { start: "24:30", label: '"Voy a la casa de Messi"', videoId: 1 },
      { start: "29:50", label: "Momento soy la disco", videoId: 1 },
      { start: "39:48", label: "ENTREVISTA A MESSI", videoId: 1 },
      { start: "1:16:47", label: "EMOCIONADOS", videoId: 1 },
      {
        start: "1:26:23",
        label: "Repercusiones a la nota de la vida",
        videoId: 1,
      },
      { start: "1:50:00", label: "GRACIAS", videoId: 1 },
    ]);
  });

  test("should correctly get the list from the video of 12/10", async () => {
    const hash = "A2HPLsdnm6s";
    const url = `https://www.youtube.com/watch?v=${hash}`;
    const res = await fetch(url);
    const html = await res.text();
    const videoId = 1;
    const raws = getRaws(html, videoId);
    expect(raws).toStrictEqual([
      {
        start: "00:00",
        label: "Entran los participantes de la gala",
        videoId: 1,
      },
      { start: "01:05", label: "Entran los participantes", videoId: 1 },
      { start: "06:27", label: "La ropa nos hace sentir cosas", videoId: 1 },
      { start: "13:10", label: "Se viene un tango de Migue", videoId: 1 },
      { start: "18:48", label: "Inversiones de Migue", videoId: 1 },
      { start: "21:52", label: "Qué comidita pa", videoId: 1 },
      { start: "27:10", label: "Te vamos a extraña Gime", videoId: 1 },
      { start: "32:29", label: "Se viene el gran concurso", videoId: 1 },
      { start: "37:28", label: "Migue vendió el celu de su mamá", videoId: 1 },
      { start: "40:50", label: "Propinas en restaurantes", videoId: 1 },
      { start: "1:15:40", label: "Concurso de eructos", videoId: 1 },
      { start: "2:08:40", label: "A Luqui le gusta el alfajor", videoId: 1 },
      { start: "2:11:16", label: "DJ Cremona", videoId: 1 },
      {
        start: "00:00",
        label: "Entran los participantes de la gala",
        videoId: 1,
      },
      { start: "01:05", label: "Entran los participantes", videoId: 1 },
      { start: "06:27", label: "La ropa nos hace sentir cosas", videoId: 1 },
      { start: "13:10", label: "Se viene un tango de Migue", videoId: 1 },
      { start: "18:48", label: "Inversiones de Migue", videoId: 1 },
      { start: "21:52", label: "Qué comidita pa", videoId: 1 },
      { start: "27:10", label: "Te vamos a extraña Gime", videoId: 1 },
      { start: "32:29", label: "Se viene el gran concurso", videoId: 1 },
      { start: "37:28", label: "Migue vendió el celu de su mamá", videoId: 1 },
      { start: "40:50", label: "Propinas en restaurantes", videoId: 1 },
      { start: "1:15:40", label: "Concurso de eructos", videoId: 1 },
      { start: "2:08:40", label: "A Luqui le gusta el alfajor", videoId: 1 },
      { start: "2:11:16", label: "DJ Cremona", videoId: 1 },
      {
        start: "00:00",
        label: "Entran los participantes de la gala",
        videoId: 1,
      },
      { start: "01:05", label: "Entran los participantes", videoId: 1 },
      { start: "06:27", label: "La ropa nos hace sentir cosas", videoId: 1 },
      { start: "13:10", label: "Se viene un tango de Migue", videoId: 1 },
      { start: "18:48", label: "Inversiones de Migue", videoId: 1 },
      { start: "21:52", label: "Qué comidita pa", videoId: 1 },
      { start: "27:10", label: "Te vamos a extraña Gime", videoId: 1 },
      { start: "32:29", label: "Se viene el gran concurso", videoId: 1 },
      { start: "37:28", label: "Migue vendió el celu de su mamá", videoId: 1 },
      { start: "40:50", label: "Propinas en restaurantes", videoId: 1 },
      { start: "1:15:40", label: "Concurso de eructos", videoId: 1 },
      { start: "2:08:40", label: "A Luqui le gusta el alfajor", videoId: 1 },
      { start: "2:11:16", label: "DJ Cremona", videoId: 1 },
      {
        start: "00:00",
        label: "Entran los participantes de la gala",
        videoId: 1,
      },
      { start: "01:05", label: "Entran los participantes", videoId: 1 },
      { start: "06:27", label: "La ropa nos hace sentir cosas", videoId: 1 },
      { start: "13:10", label: "Se viene un tango de Migue", videoId: 1 },
      { start: "18:48", label: "Inversiones de Migue", videoId: 1 },
      { start: "21:52", label: "Qué comidita pa", videoId: 1 },
      { start: "27:10", label: "Te vamos a extraña Gime", videoId: 1 },
      { start: "32:29", label: "Se viene el gran concurso", videoId: 1 },
      { start: "37:28", label: "Migue vendió el celu de su mamá", videoId: 1 },
      { start: "40:50", label: "Propinas en restaurantes", videoId: 1 },
      { start: "1:15:40", label: "Concurso de eructos", videoId: 1 },
      { start: "2:08:40", label: "A Luqui le gusta el alfajor", videoId: 1 },
      { start: "2:11:16", label: "DJ Cremona", videoId: 1 },
    ]);
  });
});

describe("dedupeCuts", () => {
  test("should dedupe correctly cuts for 21/9", () => {
    const cuts: Cuts = [
      { start: "0:00", label: "Extrañamos Argentina", videoId: 1 },
      { start: "0:40", label: "Goni líder en gastronomía", videoId: 1 },
      { start: "2:28", label: "Llegó el agüita", videoId: 1 },
      { start: "6:09", label: "La nota que se vieneee", videoId: 1 },
      { start: "7:20", label: "Famosos que fueron a ver a Messi", videoId: 1 },
      { start: "11:55", label: "La canción del beso", videoId: 1 },
      { start: "12:28", label: "Gracias todos", videoId: 1 },
      { start: "13:50", label: "Saluditos y se vieenee", videoId: 1 },
      { start: "20:50", label: "Goni es un pillín", videoId: 1 },
      { start: "24:30", label: '"Voy a la casa de Messi"', videoId: 1 },
      { start: "29:50", label: "Momento soy la disco", videoId: 1 },
      { start: "39:48", label: "ENTREVISTA A MESSI", videoId: 1 },
      { start: "1:16:47", label: "EMOCIONADOS", videoId: 1 },
      {
        start: "1:26:23",
        label: "Repercusiones a la nota de la vida",
        videoId: 1,
      },
      { start: "1:50:00", label: "GRACIAS", videoId: 1 },
      { start: "0:00", label: "Extrañamos Argentina", videoId: 1 },
      { start: "0:40", label: "Goni líder en gastronomía", videoId: 1 },
      { start: "2:28", label: "Llegó el agüita", videoId: 1 },
      { start: "6:09", label: "La nota que se vieneee", videoId: 1 },
      { start: "7:20", label: "Famosos que fueron a ver a Messi", videoId: 1 },
      { start: "11:55", label: "La canción del beso", videoId: 1 },
      { start: "12:28", label: "Gracias todos", videoId: 1 },
      { start: "13:50", label: "Saluditos y se vieenee", videoId: 1 },
      { start: "20:50", label: "Goni es un pillín", videoId: 1 },
      { start: "24:30", label: '"Voy a la casa de Messi"', videoId: 1 },
      { start: "29:50", label: "Momento soy la disco", videoId: 1 },
      { start: "39:48", label: "ENTREVISTA A MESSI", videoId: 1 },
      { start: "1:16:47", label: "EMOCIONADOS", videoId: 1 },
      {
        start: "1:26:23",
        label: "Repercusiones a la nota de la vida",
        videoId: 1,
      },
      { start: "1:50:00", label: "GRACIAS", videoId: 1 },
      { start: "0:00", label: "Extrañamos Argentina", videoId: 1 },
      { start: "0:40", label: "Goni líder en gastronomía", videoId: 1 },
      { start: "2:28", label: "Llegó el agüita", videoId: 1 },
      { start: "6:09", label: "La nota que se vieneee", videoId: 1 },
      { start: "7:20", label: "Famosos que fueron a ver a Messi", videoId: 1 },
      { start: "11:55", label: "La canción del beso", videoId: 1 },
      { start: "12:28", label: "Gracias todos", videoId: 1 },
      { start: "13:50", label: "Saluditos y se vieenee", videoId: 1 },
      { start: "20:50", label: "Goni es un pillín", videoId: 1 },
      { start: "24:30", label: '"Voy a la casa de Messi"', videoId: 1 },
      { start: "29:50", label: "Momento soy la disco", videoId: 1 },
      { start: "39:48", label: "ENTREVISTA A MESSI", videoId: 1 },
      { start: "1:16:47", label: "EMOCIONADOS", videoId: 1 },
      {
        start: "1:26:23",
        label: "Repercusiones a la nota de la vida",
        videoId: 1,
      },
      { start: "1:50:00", label: "GRACIAS", videoId: 1 },
      { start: "0:00", label: "Extrañamos Argentina", videoId: 1 },
      { start: "0:40", label: "Goni líder en gastronomía", videoId: 1 },
      { start: "2:28", label: "Llegó el agüita", videoId: 1 },
      { start: "6:09", label: "La nota que se vieneee", videoId: 1 },
      { start: "7:20", label: "Famosos que fueron a ver a Messi", videoId: 1 },
      { start: "11:55", label: "La canción del beso", videoId: 1 },
      { start: "12:28", label: "Gracias todos", videoId: 1 },
      { start: "13:50", label: "Saluditos y se vieenee", videoId: 1 },
      { start: "20:50", label: "Goni es un pillín", videoId: 1 },
      { start: "24:30", label: '"Voy a la casa de Messi"', videoId: 1 },
      { start: "29:50", label: "Momento soy la disco", videoId: 1 },
      { start: "39:48", label: "ENTREVISTA A MESSI", videoId: 1 },
      { start: "1:16:47", label: "EMOCIONADOS", videoId: 1 },
      {
        start: "1:26:23",
        label: "Repercusiones a la nota de la vida",
        videoId: 1,
      },
      { start: "1:50:00", label: "GRACIAS", videoId: 1 },
    ];
    expect(dedupe(cuts)).toStrictEqual([
      { start: "0:00", label: "Extrañamos Argentina", videoId: 1 },
      { start: "0:40", label: "Goni líder en gastronomía", videoId: 1 },
      { start: "2:28", label: "Llegó el agüita", videoId: 1 },
      { start: "6:09", label: "La nota que se vieneee", videoId: 1 },
      { start: "7:20", label: "Famosos que fueron a ver a Messi", videoId: 1 },
      { start: "11:55", label: "La canción del beso", videoId: 1 },
      { start: "12:28", label: "Gracias todos", videoId: 1 },
      { start: "13:50", label: "Saluditos y se vieenee", videoId: 1 },
      { start: "20:50", label: "Goni es un pillín", videoId: 1 },
      { start: "24:30", label: '"Voy a la casa de Messi"', videoId: 1 },
      { start: "29:50", label: "Momento soy la disco", videoId: 1 },
      { start: "39:48", label: "ENTREVISTA A MESSI", videoId: 1 },
      { start: "1:16:47", label: "EMOCIONADOS", videoId: 1 },
      {
        start: "1:26:23",
        label: "Repercusiones a la nota de la vida",
        videoId: 1,
      },
      { start: "1:50:00", label: "GRACIAS", videoId: 1 },
    ]);
  });
});
