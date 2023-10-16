import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <h1 class='text-6xl'>Olga TV</h1>
  );
});

export const head: DocumentHead = {
  title: "Olga TV",
  meta: [
    {
      name: "description",
      content: "Stream art",
    },
  ],
};
