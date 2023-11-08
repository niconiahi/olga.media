import { test, expect, describe } from "vitest";
import type { Cuts } from "~/utils/cut";
import { cutsSchema, dedupe, getRaws } from "~/utils/cut";

describe("getRaws", () => {
  test("should correctly get the list from the video of 21/9", async () => {
    const hash = "30bcG4mLRNA";
    const url = `https://www.youtube.com/watch?v=${hash}`;
    const res = await fetch(url);
    const html = await res.text();
    const videoId = 1;
    const raws = getRaws(html, videoId);
    const result = cutsSchema.safeParse(raws);
    if (!result.success) {
      throw new Error(result.error.toString());
    }

    const cuts = result.data;
    expect(dedupe(cuts)).toStrictEqual([
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
    const result = cutsSchema.safeParse(raws);
    if (!result.success) {
      throw new Error(result.error.toString());
    }

    const cuts = result.data;
    expect(dedupe(cuts)).toStrictEqual([
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

  test("should correctly get the list from the video of 9/10", async () => {
    const hash = "cBzUBQSCJ5o";
    const url = `https://www.youtube.com/watch?v=${hash}`;
    const res = await fetch(url);
    const html = await res.text();
    const videoId = 1;
    const raws = getRaws(html, videoId);
    const result = cutsSchema.safeParse(raws);
    if (!result.success) {
      throw new Error(result.error.toString());
    }

    const cuts = result.data;
    expect(dedupe(cuts)).toStrictEqual([
      { start: "00:00", label: "Muy lunes todo", videoId: 1 },
      { start: "00:22", label: "EIO PLANCHA", videoId: 1 },
      { start: "04:14", label: "Secretos de la TV", videoId: 1 },
      {
        start: "08:00",
        label: "Leti tiene que ir a la fonoaudióloga",
        videoId: 1,
      },
      {
        start: "12:20",
        label: "Nati recibió una propuesta laboral",
        videoId: 1,
      },
      { start: "16:30", label: "Ser extra en actuaciones", videoId: 1 },
      { start: "19:09", label: "Juan Lambada modo fachero", videoId: 1 },
      { start: "21:12", label: "Cuándo entrás a la tercera edad", videoId: 1 },
      {
        start: "23:25",
        label: "Previa en lo de Eial y fiestita del viernes",
        videoId: 1,
      },
      {
        start: "29:39",
        label: "Eial y Nati se maquillaron juntos",
        videoId: 1,
      },
      {
        start: "33:22",
        label: "Eial cuenta qué está pasando en Israel",
        videoId: 1,
      },
      {
        start: "44:42",
        label: "El debate post debate presidencial",
        videoId: 1,
      },
      {
        start: "47:15",
        label: "Marra contra la cerveza en el debate",
        videoId: 1,
      },
      {
        start: "52:03",
        label: "Las sensaciones de Rosendo y Quintín Palma",
        videoId: 1,
      },
      { start: "58:00", label: "Marra fan de Olga", videoId: 1 },
      {
        start: "1:06:11",
        label: "Cambiazo: Iñaki Gutiérrez reemplazó a Marra",
        videoId: 1,
      },
      { start: "1:12:47", label: "Israel en el debate", videoId: 1 },
      { start: "1:17:55", label: "Libre portación de armas", videoId: 1 },
      { start: "1:35:11", label: "Massa contra Milei", videoId: 1 },
    ]);
  });

  test("should correctly get the list from the video of 21/9", async () => {
    const hash = "30bcG4mLRNA";
    const url = `https://www.youtube.com/watch?v=${hash}`;
    const res = await fetch(url);
    const html = await res.text();
    const videoId = 1;
    const raws = getRaws(html, videoId);
    const result = cutsSchema.safeParse(raws);
    if (!result.success) {
      throw new Error(result.error.toString());
    }

    const cuts = result.data;
    expect(dedupe(cuts)).toStrictEqual([
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

  test("should correctly get the list from the video of 30/10", async () => {
    const hash = "wHPCkdM46lI";
    const url = `https://www.youtube.com/watch?v=${hash}`;
    const res = await fetch(url);
    const html = await res.text();
    const videoId = 1;
    const raws = getRaws(html, videoId);
    const result = cutsSchema.safeParse(raws);
    if (!result.success) {
      throw new Error(result.error.toString());
    }

    const cuts = result.data;
    expect(dedupe(cuts)).toStrictEqual([
      { start: "00:00", label: "QUÉ DIFÍCIL QUE ESTÁ EL LUNES", videoId: 1 },
      { start: "01:53", label: "Eial Pajerman", videoId: 1 },
      {
        start: "04:10",
        label: "Cancelaciones y tutorial para acomodarse los huevos",
        videoId: 1,
      },
      { start: "12:11", label: "Se busca pareja", videoId: 1 },
      { start: "14:11", label: "PAJERMAAAAAN", videoId: 1 },
      { start: "18:32", label: "PAJEIOOOO", videoId: 1 },
      { start: "24:24", label: "Finde de Halloween", videoId: 1 },
      {
        start: "29:46",
        label: "Nati manda donde estuás a la persona equivocada",
        videoId: 1,
      },
      { start: "31:38", label: "Qué hizo Homero el finde", videoId: 1 },
      { start: "33:48", label: "Habló Pajeio", videoId: 1 },
      { start: "40:00", label: "Historias respondibles", videoId: 1 },
      { start: "51:17", label: "SE ACTIVÓ HÉRCULA", videoId: 1 },
      { start: "1:03:08", label: "5 MINUTOS DE PIBARDO", videoId: 1 },
      { start: "1:06:56", label: "Spider Man en el obelisco", videoId: 1 },
      { start: "1:14:09", label: "Qué pasó con la nafta", videoId: 1 },
      {
        start: "1:17:09",
        label: "Se perdió un perro en la esquina de Olguita",
        videoId: 1,
      },
      {
        start: "1:23:25",
        label: "Vivir solos o convivir con alguien",
        videoId: 1,
      },
      { start: "1:34:38", label: "Filosofía hoy", videoId: 1 },
      { start: "1:58:33", label: "Cuarenta años de democracia", videoId: 1 },
      { start: "2:07:13", label: "Eial peinateee", videoId: 1 },
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
