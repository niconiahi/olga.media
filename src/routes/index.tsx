import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";

const url = `https://www.youtube.com/watch?v=I4XrQIWW11Y`
// const url = `https://www.youtube.com/watch?v=A2HPLsdnm6s`
// const url = `https://www.youtube.com/watch?v=30y7OQk7d-Y`


function getSeconds(timestamp: string) {
  const parts = timestamp.split(':').map(Number);
  
  let seconds = 0;

  if (parts.length === 3) {
      seconds += parts[0] * 3600; 
      seconds += parts[1] * 60;   
      seconds += parts[2];        
  } else if (parts.length === 2) {
      seconds += parts[0] * 60;   
      seconds += parts[1];        
  }  else if (parts.length === 1) {
      seconds = parts[0];
  }

  return seconds;
}

export const useList = routeLoader$(async () => {
  const res = await fetch(url);
  const html = await res.text();
  const regex = /(\d+:\d{2}(?::\d{2})?) (.*?)(?=\\n|$)/g;
  const list = [];

  let match;
  while ((match = regex.exec(html)) !== null) {
    list.push({
        time: match[1],
        label: match[2]
    });
  }

  const index = list.slice(1, list.length).findIndex((element) => element.time === "0:00")

  return list.slice(0, index + 1);
});

export default component$(() => {
  const list = useList()

  return (
    <main>
    <h1 class='text-6xl'>Olga TV</h1>
    <ul>
      {Array.from(list.value).map((li) => (
        <a href={url + '&t='+ getSeconds(li.time)} key={`youtube_link_${li.time}`}>
          <l1 class='block'>{li.label}</l1>
        </a>
      ))}
    </ul>
  </main>
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
