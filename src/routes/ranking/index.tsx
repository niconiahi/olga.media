import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { Cuts } from "~/routes/cut/get/ranking";
import { cutsSchema } from "~/routes/cut/get/ranking";
import clsx from "clsx";

export const useCuts = routeLoader$(async ({ request }) => {
  const url = new URL(request.url);
  const raws = await (await fetch(url.origin + "/cut/get/ranking")).json();
  const result = cutsSchema.safeParse(raws);
  if (!result.success) {
    throw new Error(result.error.toString());
  }
  const cuts = result.data;
  const cutsByShow = cuts.reduce<{ [show: string]: Cuts }>((prevShows, cut) => {
    const { show } = cut;

    return {
      ...prevShows,
      [show]: prevShows[show] ? [...prevShows[show], cut] : [cut],
    };
  }, {});

  return { cutsByShow };
});

export default component$(() => {
  const cuts = useCuts();

  return (
    <section class="flex h-full flex-1 flex-col items-start justify-center space-y-2">
      <h2 class="bebas text-3xl uppercase leading-none text-brand-red">
        Top 20
      </h2>
      <ul class="w-full grow space-y-2">
        {Object.entries(cuts.value.cutsByShow).map(([_show, cuts]) => {
          const show = _show.toLocaleLowerCase().includes("volaba")
            ? "sone-que-volaba"
            : "seria-increible";

          return (
            <li
              key={`show-${show}`}
              class={clsx([
                "mr-0.5 space-y-2 border-2 p-2",
                show === "sone-que-volaba"
                  ? "border-show-soneQueVolaba-blue shadow-soneQueVolaba"
                  : "border-show-seriaIncreible-purple shadow-seriaIncreible",
              ])}
            >
              {show === "seria-increible" ? <SeriaIncreibleIcon /> : null}
              {show === "sone-que-volaba" ? <SoneQueVolabaIcon /> : null}
              <ul>
                {cuts.map(({ label, start, hash, upvotes }) => {
                  return (
                    <li
                      key={`cut-${show}-${hash}`}
                      class="flex items-start py-0.5"
                    >
                      <a
                        class={clsx([
                          "mr-2 flex w-full items-start justify-between space-x-2 px-0.5 font-medium md:hover:cursor-pointer",
                          show === "sone-que-volaba"
                            ? "outline-4 focus-visible:outline focus-visible:outline-show-soneQueVolaba-blue md:hover:bg-show-soneQueVolaba-blueHover"
                            : "outline-4 focus-visible:outline focus-visible:outline-show-seriaIncreible-purple md:hover:bg-show-seriaIncreible-purpleHover",
                        ])}
                        target="_blank"
                        href={
                          `https://www.youtube.com/watch?v=${hash}` +
                          "&t=" +
                          getSeconds(start)
                        }
                      >
                        <span
                          class={clsx([
                            "mabry",
                            show === "sone-que-volaba"
                              ? "text-show-soneQueVolaba-blue"
                              : "text-show-seriaIncreible-purple",
                          ])}
                        >
                          {label}
                        </span>
                        <span class="mabry text-brand-red">{start}</span>
                      </a>
                      <div class="flex w-[4.75rem] items-center justify-end bg-brand-blueHover">
                        <span class="mabry px-1 text-brand-blue">
                          {upvotes}
                          <span class="sr-only">votos</span>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
});

export const SoneQueVolabaIcon = component$(() => {
  return (
    <svg viewBox="0 0 349 118" class="w-32" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M132.866 8.03339C139.293 7.32292 146.128 11.3898 148.51 3.2487C148.824 2.17303 148.816 1.10668 148.887 0C146.94 0.129418 145.121 0.91918 143.215 1.03269C141.547 1.13207 140.062 0.192882 138.405 0.150626C133.839 0.0342222 133.163 4.41861 132.866 8.03339ZM168.112 8.83673H172.918C174.041 6.32011 175.116 4.40824 175.321 1.60668C168.984 0.445933 168.129 2.85643 168.112 8.83673ZM82.3998 37.7569C78.7038 37.6776 75.4283 35.5596 71.9301 35.5384C68.9173 35.5204 67.5099 37.8905 68.6402 40.62C72.4083 49.7162 85.8579 48.8043 90.7595 41.5411C92.5419 38.9004 92.4201 34.312 91.5534 31.3339C90.2244 26.7654 86.397 26.5868 82.7402 24.7634C81.5363 24.1628 79.1916 23.1209 78.8968 21.6214C78.5884 20.0493 80.6679 20.1247 81.618 20.2019C85.4214 20.5107 93.1499 18.8122 88.3252 13.2545C84.6772 9.05323 74.443 9.49466 70.6356 13.1987C67.7374 16.018 67.32 22.1408 68.8541 25.7069C71.7651 32.4759 79.4784 31.9309 82.3998 37.7569ZM106.431 10.8916C86.3329 16.1392 92.1029 54.08 114.291 48.78C117.798 47.9421 121.247 42.5052 122.488 39.3518C126.669 28.7311 121.859 6.86349 106.431 10.8916ZM259.432 10.4434C257.992 21.8642 257.328 35.2301 259.432 46.5937C264.757 46.5937 273.466 47.6987 278.321 45.3056C280.796 44.0855 282.032 39.0061 279.202 37.5499C276.119 35.9629 270.831 36.9536 267.442 36.9536C268.071 32.9988 270.066 32.2572 273.85 32.1336C274.225 30.0819 275.05 27.4425 273.593 25.6207C272.584 24.3594 268.283 23.9209 268.749 21.8266C269.409 18.8569 275.816 20.8631 277.6 18.2214C279.394 15.5667 278.179 11.9227 275.208 10.8562C270.733 9.24957 264.156 10.4434 259.432 10.4434ZM159.3 49.807C164.619 49.807 173.465 51.5278 178.343 49.3226C181.325 47.974 181.648 42.957 178.979 41.1141C175.971 39.0369 170.003 40.167 166.51 40.167C167.356 34.7338 171.018 36.5073 173.697 33.1446C176.061 30.1774 173.549 27.055 170.535 26.5976C169.495 26.4397 168.355 26.5197 167.311 26.5102V21.6902C169.914 21.6902 173.348 22.2412 175.736 21.0009C178.698 19.4622 179.675 14.2056 176.669 12.1939C172.578 9.4557 160.162 10.2497 158.181 15.2988C157 18.3117 157.698 22.5237 157.698 25.7069C157.698 33.7869 156.883 42.0378 159.3 49.807ZM206.562 11.6032C202.116 12.3832 200.713 14.7744 198.495 18.4049C193.493 26.5917 194.002 41.245 201.86 47.945C204.952 50.5814 210.771 50.2223 214.573 49.599C216.716 49.2471 221.984 48.7015 223.359 46.9123C224.98 44.8029 223.443 41.0309 223.827 38.5603C225.224 29.5818 226.424 13.1805 213.772 11.3627C211.452 11.0294 208.861 11.1998 206.562 11.6032ZM136.07 35.3469C140.683 38.9247 143.336 44.5599 145.683 49.807C148.86 49.7693 151.489 49.6022 153.234 46.5466C154.991 43.4711 154.494 39.5528 154.494 36.1503C154.494 28.0702 155.31 19.8193 152.892 12.0501H145.683C145.683 16.8959 146.007 21.7699 144.882 26.5102H143.28C142.386 22.4009 139.883 16.2991 136.536 13.5712C132.779 10.5084 128.058 13.3157 127.377 17.6741C126.377 24.0778 127.259 31.2759 127.259 37.7569C127.259 40.4739 126.738 43.9493 127.946 46.4747C129.159 49.0117 133.331 49.9115 134.786 47.0487C136.267 44.1328 136.003 38.6069 136.07 35.3469ZM227.39 13.6568C227.39 23.0862 225.546 34.7002 230.239 43.3078C235.781 53.4711 248.894 48.9859 253.401 40.6287C256.093 35.6351 255.348 24.8661 254.51 19.3124C254.165 17.0253 252.509 14.4278 249.834 14.8227C246.099 15.3741 246.62 20.5778 246.615 23.2968C246.604 30.0788 247.305 37.902 238.604 38.5603C237.131 32.2748 237.016 26.5839 237.002 20.0835C236.997 17.7635 237.43 14.5465 235.145 13.1125C232.643 11.5415 229.919 13.15 227.39 13.6568ZM288.269 17.6735C287.23 18.9544 287.04 19.2948 286.667 20.8868C288.273 19.8847 288.929 19.4915 288.269 17.6735ZM49.1674 20.8949C45.2855 23.1173 39.2198 29.2813 42.3813 34.2882C44.8179 38.147 55.3708 37.4044 58.7825 35.4083C67.2792 30.4372 57.0682 16.3718 49.1674 20.8949ZM292.411 20.8633C288.389 22.7123 282.317 29.229 285.252 34.1953C287.56 38.1005 297.344 38.2536 300.915 36.5005C310.35 31.8685 300.997 16.9158 292.411 20.8633ZM192.143 20.8868V24.1002C192.712 22.6867 192.712 22.3003 192.143 20.8868Z"
        fill="#006BA6"
      />
      <path
        d="M2.29489 49.807L3.09594 46.5937C11.5493 47.6941 19.5431 51.1486 27.9285 52.6476C33.7878 53.6952 39.6553 53.4903 45.5515 53.896C50.9929 54.2696 56.8952 54.407 60.0874 59.5218C61.8953 62.4203 61.5725 65.812 61.5725 69.0872C61.5725 75.0142 61.2913 80.9131 62.3736 86.7606C64.9986 85.1082 65.5946 82.4628 66.3788 79.5306C63.6865 79.5306 64.7767 75.346 64.7767 73.1039C64.7767 67.4668 64.9345 58.6687 59.9704 55.1629C52.8699 50.1485 44.7001 53.3257 36.74 52.217C29.541 51.2145 22.3268 48.402 15.1117 47.397C10.8083 46.7976 6.43255 42.4576 1.62738 44.3176C-1.54141 45.5441 0.603237 48.5672 2.29489 49.807ZM262.636 89.1706C259.879 87.9287 258.624 86.4714 257.829 83.5473C266.769 81.8217 270.044 65.3589 263.993 59.1571C257.309 52.3046 244.643 53.7177 236.201 54.5604C232.701 54.9098 225.093 52.7906 224.185 57.0371C233.014 55.918 242.587 55.4505 251.421 56.8226C255.944 57.5247 261.09 59.4905 263.757 63.5072C267.171 68.6461 262.877 76.2883 259.188 80.0929C257.789 81.5357 255.614 82.7038 254.735 84.5771C253.352 87.5214 257.672 90.5323 260.233 90.6512C264.367 90.8416 266.124 85.5894 267.879 82.7439C271.71 76.5301 274.227 69.7636 277.998 63.4638C279.572 60.8353 280.891 57.6958 283.506 55.9148C287.983 52.8686 295.914 55.0095 301.086 54.3981C307.703 53.6149 314.544 53.8366 321.112 52.7593C329.386 51.4025 337.666 48.9385 345.945 47.397C343.855 54.7556 331.867 57.0114 325.118 57.8404V59.4471C330.117 59.4463 334.624 58.2702 339.536 57.8404C337.4 66.1405 325.985 67.4757 318.709 67.4805C321.542 71.8579 329.472 68.6365 333.929 68.2838C330.409 75.6906 321.985 76.3204 314.704 76.3172C312.431 76.3164 308.942 76.8587 307.189 75.0295C305.2 72.9544 306.124 65.6023 305.892 62.6605H303.489V99.6141C303.489 102.98 304.824 110.104 302.205 112.675C299.152 115.672 290.632 114.074 286.667 114.074C286.667 111.937 287.282 108.42 285.844 106.637C284.437 104.894 281.43 105.249 279.458 105.238C272.763 105.203 269.045 106.772 268.243 114.074C263.781 114.074 259.09 114.493 254.657 113.971C250.743 113.509 248.262 112.52 244.212 113.271C245.855 113.973 247.213 114.036 249.018 114.074V116.484C254.548 116.484 261.964 117.803 267.271 116.229C270.764 115.192 271.484 110.271 274.225 108.132C276.691 106.208 283.091 105.957 285.043 108.799C286.306 110.638 285.865 113.57 285.866 115.681H298.683C300.474 115.677 303.095 116.057 304.608 114.855C306.752 113.153 305.892 108.435 305.892 106.041V87.564C305.892 85.2206 305.345 81.8458 306.716 79.786C308.099 77.7062 310.919 77.94 313.102 77.9247C317.959 77.891 323.575 78.72 328.322 77.5905C337.633 75.3749 338.698 64.0358 343.22 57.0371C345.205 53.9643 349.294 51.5768 348.983 47.4447C348.696 43.6177 344.524 44.6639 341.94 45.2566C334.515 46.9595 326.297 50.3067 318.709 50.5951C311.471 50.8715 304.349 51.4137 297.081 51.4137C292.678 51.4137 287.672 50.8184 283.6 52.8629C274.982 57.1889 272.131 70.8135 268.093 78.7272C266.278 82.2828 263.606 85.2431 262.636 89.1706Z"
        fill="#006BA6"
      />
      <path
        d="M3.09595 48.2003C5.89113 54.3547 11.6217 54.6544 17.5148 56.347C20.7007 57.262 23.8523 58.6381 27.1274 59.1852C31.1915 59.8648 34.0304 59.325 37.541 61.8571C28.5368 61.8515 20.0678 59.4471 11.1064 59.4471C11.5408 65.0889 15.1234 65.0656 19.782 66.2361C25.5037 67.6741 32.3685 68.3368 38.2945 67.3624C40.4364 67.0097 41.6092 65.8481 39.9442 64.2671C46.2028 63.6582 44.7505 71.1293 44.7505 75.5139V101.221C44.7505 104.357 43.8223 109.335 45.2338 112.212C46.1856 114.152 48.5094 114.036 50.3585 114.07C55.1609 114.162 59.9736 114.074 64.7767 114.074C65.1973 110.298 67.3817 108.476 68.971 105.206C72.7672 97.3976 76.4368 86.947 83.2008 81.1373C84.7573 93.4894 82.0954 109.036 96.8187 114.03C99.1938 114.836 101.546 114.884 104.028 114.877C107.239 114.868 110.501 114.615 113.629 113.83C119.023 112.477 122.526 107.474 128.06 106.041L128.861 114.074H162.505C166.401 114.074 172.972 115.33 176.469 113.385C179.117 111.912 179.796 107.946 180.128 105.237C185.552 105.237 190.769 105.359 196.149 106.041C196.154 108.084 195.735 111.067 197.093 112.786C199.269 115.539 207.419 114.074 210.568 114.074C220.085 114.074 229.886 114.758 239.374 114.03C241.951 113.832 244.066 112.141 246.627 112.085C253.034 111.947 260.326 115.371 266.566 112.112C269.144 110.765 269.804 108.226 271.887 106.494C274.322 104.469 280.516 104.714 283.416 105.586C287.193 106.72 285.702 110.124 287.723 112.553C289.708 114.939 298.147 114.909 300.738 113.59C304.056 111.901 302.688 104.276 302.688 101.221V62.6605H305.892C306.315 67.977 310.252 67.4789 314.704 67.4805C323.824 67.4837 329.862 66.2795 337.934 61.8571C336.727 58.2116 334.056 58.8125 330.725 59.4471C322.776 60.9614 315.6 61.8571 307.494 61.8571C311.102 58.1634 316.372 59.8054 321.112 59.3636C325.764 58.9289 330.242 56.772 334.73 55.571C337.258 54.8946 342.581 54.2607 343.537 51.3414C345.268 46.0539 334.284 49.0655 332.327 49.5403C323.994 51.5647 316.154 54.2149 307.494 54.5957C300.426 54.9058 291.933 53.1272 285.069 54.8825C281.047 55.9108 279.48 60.2424 277.514 63.4638C274.639 68.1714 272.937 73.1352 270.363 77.9239C267.365 83.4983 263.952 88.4701 262.636 94.794C256.182 92.5631 255.019 88.9907 253.824 82.7439C260.56 81.1003 263.467 74.0076 263.436 67.4805C263.426 65.4561 263.598 63.0878 262.153 61.4659C260.87 60.0271 258.739 59.5845 257.028 58.8799C249.424 55.7477 243.355 57.0339 235.4 57.0371C232.237 57.0387 227.229 56.0779 224.994 58.8992C222.243 62.3721 222.31 70.3846 221.618 74.7105C220.127 84.022 215.479 93.3826 215.374 102.827C211.08 100.315 211.376 94.4839 211.369 89.974V57.0371H189.74C187.432 68.2662 178.787 78.1392 173.806 88.3673C171.835 92.4145 169.441 99.5723 165.445 102.002C161.504 104.398 153.391 102.827 148.887 102.827C145.301 87.4772 155.168 73.2525 155.295 57.8404C151.55 57.8404 145.173 56.629 142.117 59.2286C137.657 63.0236 139.649 70.3597 135.269 74.7105C134.425 69.292 130.562 61.208 125.613 58.422C120.689 55.6497 108.582 55.9365 103.227 57.5584C99.6351 58.6462 97.1967 61.649 93.6145 62.6605L94.4155 59.4471C92.7141 58.7249 92.7325 58.7434 92.0124 57.0371C88.0143 57.0371 81.4746 55.7831 77.8482 57.6332C75.5692 58.7956 75.4306 62.9336 74.3572 65.0705C70.8487 72.0547 66.1737 79.2743 63.9757 86.7606C60.2588 84.4743 60.7715 81.1405 60.7715 77.1206C60.7715 71.7205 61.937 62.6082 58.4532 58.0613C55.2987 53.9426 47.834 53.847 43.1484 53.8245C39.2266 53.8052 35.0101 54.2696 31.1327 53.6149C27.5908 53.0164 24.3096 51.3663 20.719 50.8514C18.0892 50.4746 15.3306 51.0096 12.7401 50.4818C9.19882 49.7612 6.91222 48.2139 3.09595 48.2003Z"
        fill="#FF9600"
      />
      <path
        d="M265.84 50.6104C269.501 52.1512 273.935 51.2812 277.856 52.217C275.382 49.378 269.389 50.6104 265.84 50.6104Z"
        fill="#006BA6"
      />
      <path
        d="M103.227 53.8237C107.593 57.1407 118.513 55.9951 124.054 56.2337V54.6271C116.842 53.0148 110.629 52.8854 103.227 53.8237Z"
        fill="#006BA6"
      />
      <path
        d="M75.9914 57.8404C82.0497 55.4649 87.142 55.4304 93.6145 55.4304V62.6605H96.8187C97.3425 60.5204 99.4797 57.1126 97.7799 55.1115C96.318 53.3915 93.1995 53.8277 91.2113 53.8237C86.1839 53.8133 77.7914 51.8949 75.9914 57.8404Z"
        fill="#006BA6"
      />
      <path
        d="M6.30017 54.6271C7.63736 60.0102 10.0248 63.5433 12.313 68.4204C13.6702 71.3132 14.144 74.01 17.0686 75.8569C21.8593 78.8831 31.1941 78.7264 36.74 78.7272V77.1206C31.9539 77.0185 25.2441 76.3775 20.7623 74.688C18.6537 73.8935 17.2358 72.2178 15.1117 71.4972C14.9465 65.922 11.0199 62.9545 9.50437 57.8404H15.1117C12.7918 54.4367 10.1648 54.6303 6.30017 54.6271Z"
        fill="#006BA6"
      />
      <path
        d="M139.274 55.4304C138.86 59.5772 137.063 63.2758 136.871 67.4805C134.876 65.3701 133.515 62.9344 131.264 61.0538C131.911 66.0369 135.108 69.7202 135.269 74.7105C139.867 71.6876 140.819 62.2588 140.876 57.0371H156.897C156.734 60.2794 155.479 62.7922 154.739 65.8738C154.231 67.989 154.674 70.1789 154.116 72.3005C152.511 78.4003 150.316 84.504 149.621 90.7773C149.337 93.3392 147.801 96.2031 148.197 98.7882C148.582 101.3 150.852 101.197 152.892 101.221C156.546 101.263 166.408 103.038 167.311 98.8107C161.735 99.8486 156.14 99.6141 150.489 99.6141C151.696 84.2968 158.642 70.0158 159.301 54.6271L139.274 55.4304ZM183.332 68.2838C187.782 66.1333 189.168 61.7495 189.74 57.0371C197.655 56.0337 205.06 56.4113 212.971 57.0371V89.1706C212.971 93.1102 211.718 98.8436 215.374 101.221C216.445 88.1761 223.34 75.9019 223.384 62.6604C221.205 65.3316 221.328 68.2404 220.561 71.4972C219.346 76.6578 217.965 81.7743 216.175 86.7606C214.214 80.109 215.374 71.9848 215.374 65.0705C215.374 62.5624 216.212 58.018 214.55 55.9148C212.676 53.5417 206.816 54.6271 204.159 54.6271C200.345 54.6271 194.336 53.4903 190.816 55.1115C187.143 56.8041 184.25 64.6037 183.332 68.2838Z"
        fill="#006BA6"
      />
      <path
        d="M269.845 58.6438V63.4638H272.248C272.068 61.057 271.806 60.0504 269.845 58.6438Z"
        fill="#006BA6"
      />
      <path
        d="M75.1904 59.4471C73.432 62.3704 72.2137 64.8487 71.9862 68.2838C74.5591 65.8907 76.5449 62.9713 75.1904 59.4471ZM307.495 61.8571C311.272 61.3783 314.894 61.0546 318.709 61.0538V59.4471C314.908 59.4471 309.78 58.3224 307.495 61.8571ZM27.9285 60.2504C30.8144 62.2274 34.1419 61.8571 37.5411 61.8571C34.7519 59.7379 31.3243 60.2504 27.9285 60.2504Z"
        fill="#006BA6"
      />
      <path
        d="M43.1484 64.2671C41.3464 70.2199 32.9673 68.2838 27.9285 68.2838C30.7769 72.327 38.6784 70.6938 43.1484 70.6938V116.484H59.1694C61.7111 116.48 64.6974 116.787 66.8114 115.085C74.334 109.028 73.4969 94.8719 82.3998 89.974C82.3998 101.794 85.8763 116.075 100.023 117.851C103.46 118.282 108.645 117.714 112.039 116.974C117.449 115.793 121.524 111.446 126.457 109.254C126.304 111.303 125.217 114.822 127.525 116C130.863 117.702 137.197 116.484 140.876 116.484H164.908C168.544 116.484 173.246 117.273 176.752 116.229C181.435 114.833 180.728 107.835 186.537 106.964C195.446 105.629 192.296 114.579 198.552 116.484C197.265 112.85 196.184 109.953 196.149 106.041H180.128C179.302 108.596 178.45 112.066 175.848 113.385C172.134 115.266 165.771 114.074 161.704 114.074H128.861C128.838 111.325 128.56 108.742 128.06 106.041C121.074 107.149 117.161 113.546 110.436 115.236C108.111 115.82 105.607 115.716 103.228 115.677C100.847 115.638 98.8165 115.261 96.6216 114.324C82.2171 108.173 85.491 93.5087 83.2008 81.1372C78.304 87.0024 74.5415 95.129 71.2572 102.024C69.6375 105.424 68.2909 110.343 65.2654 112.786C62.0355 115.394 52.7105 114.597 48.7712 113.955C47.1843 113.697 45.907 113.091 45.2338 111.545C43.5628 107.707 44.7505 101.337 44.7505 97.204V64.2671H43.1484Z"
        fill="#006BA6"
      />
      <path
        d="M237.803 68.2838C238.148 72.3045 235.354 77.8195 240.206 79.5306C238.306 73.9867 239.541 70.0954 245.814 69.8905C243.379 68.0404 240.793 68.2862 237.803 68.2838Z"
        fill="#006BA6"
      />
      <path
        d="M329.924 68.2838C323.474 73.2091 307.032 65.9654 306.693 76.3172C314.43 76.3172 330.289 78.7594 333.128 69.0872L329.924 68.2838Z"
        fill="#FF9600"
      />
      <path
        d="M39.1431 70.6938H30.3316C28.1628 70.6898 26.0515 70.6858 23.9232 70.2175C21.676 69.7218 14.2136 70.0721 18.743 73.957C20.7073 75.6424 23.9283 75.3894 26.3264 75.6472C32.0447 76.2618 38.7233 78.2934 39.1431 70.6938Z"
        fill="#FF9600"
      />
      <path
        d="M118.447 73.9072C116.386 76.6353 117.108 79.4784 116.742 82.7439C115.899 90.2632 112.639 100.137 104.028 100.417C103.042 95.6006 101.754 91.036 102.633 86.0296C103.717 79.8591 107.36 75.1058 110.436 69.8905C105.606 69.8977 104.474 73.7891 103.322 77.9239C101.637 83.9738 98.0555 91.669 100.71 97.9921C104.577 107.203 112.207 100.48 114.781 94.782C115.963 92.1679 117.089 89.582 117.679 86.7606C118.568 82.5037 118.447 78.23 118.447 73.9072Z"
        fill="#006BA6"
      />
      <path
        d="M284.264 75.5139C282.518 79.1281 281.839 83.0725 279.983 86.6883C279.28 88.0596 277.894 89.7796 278.445 91.4288C279.598 94.8776 284.925 93.6541 287.468 93.1873C287.468 87.4539 288.294 81.0336 286.667 75.5139H284.264ZM196.149 94.794V88.3673C196.149 86.3839 197.213 79.2181 194.41 78.6638C192.17 78.2211 190.93 83.7039 190.261 85.1539C187.046 92.1277 188.817 94.7884 196.149 94.794Z"
        fill="#006BA6"
      />
      <path
        d="M234.267 90.8279C231.956 92.3703 230.428 98.4677 232.218 100.736C234.021 103.021 238.882 101.949 240.889 100.531C247.3 95.9998 240.331 86.7815 234.267 90.8279Z"
        fill="#006BA6"
      />
      <path
        d="M275.453 110.861V112.467C278.102 112.551 280.222 113.119 281.861 110.861H275.453Z"
        fill="#006BA6"
      />
      <path
        d="M213.772 114.877C216.943 116.212 220.773 115.681 224.185 115.681H243.411C240.239 114.346 236.409 114.877 232.997 114.877H213.772Z"
        fill="#006BA6"
      />
    </svg>
  );
});

export const SeriaIncreibleIcon = component$(() => {
  return (
    <svg viewBox="0 0 181 119" class="w-28" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M43.1237 44.8824C41.5195 50.3094 41.9292 55.6814 44.1237 60.8824C34.0252 59.6064 24.1474 61.7654 14.1237 63.4474C10.1782 64.1094 4.82545 63.9574 2.01715 67.3124C-0.723546 70.5864 0.123655 75.9264 0.123655 79.8824C0.123655 89.2124 -0.00264446 98.5534 0.127556 107.882C0.185156 112.015 0.708655 116.342 5.16766 117.949C8.87056 119.284 13.4123 117.59 17.1237 116.963C25.9266 115.477 35.229 113.187 44.1237 112.681C50.631 112.312 56.317 110.795 62.6993 109.915C81.7027 107.295 101.023 105.22 120.124 102.454C125.532 101.671 130.757 99.8414 136.124 99.0914C145.447 97.7884 154.791 97.3454 164.124 95.8024C167.588 95.2294 171.943 95.3814 175.08 93.7034C183.141 89.3904 178.531 81.5424 178.48 74.8824C178.44 69.6404 180.556 64.4124 177.124 59.8824C178.43 57.9034 179.505 56.2684 179.9 53.8774C182.713 36.8498 158.533 38.5361 151.124 47.8824C146.427 44.106 141.731 45.1737 136.124 45.8824C135.779 37.8413 134.076 29.8748 133.174 21.8824C132.758 18.1905 132.604 13.2512 129.552 10.6247C126.823 8.27576 122.46 8.88456 119.124 8.88236C118.854 7.61156 118.808 6.29916 117.946 5.23186C109.933 -4.68104 101.544 9.31476 94.9537 12.3184C89.6757 14.7243 81.8467 14.835 76.1237 14.8824C81.9277 2.59066 65.057 -0.272138 56.1237 0.0196621C52.8062 0.128062 50.2243 1.85676 47.1237 2.71726C43.9399 3.60076 40.9778 3.31837 38.1677 5.39707C35.5906 7.30337 34.3559 10.0681 32.3251 12.4272C30.3703 14.698 27.7208 16.1549 26.3027 18.9009C23.6541 24.0297 25.0231 40.4942 30.3482 43.7034C33.8202 45.7957 39.2341 44.8824 43.1237 44.8824Z"
        fill="#F8C552"
      />
      <path
        d="M56.1237 5.88232C56.1237 11.5148 55.4407 14.1353 53.1237 18.8823C59.6666 17.7904 58.1237 11.208 58.1237 5.88232H56.1237ZM112.124 7.88232C109.515 9.73602 106.989 11.4622 104.124 12.8823C107.496 13.9398 112.224 11.7351 112.124 7.88232ZM42.1237 9.88232C45.2518 14.9468 47.6707 16.3965 45.1237 21.8823C52.881 19.5041 46.7993 12.3863 42.1237 9.88232ZM70.1237 9.88232C68.2188 14.0229 65.5446 16.6525 61.1237 17.8823C65.9848 21.4455 71.4278 14.8661 70.1237 9.88232ZM89.7907 13.2156C89.3457 13.6601 90.4017 13.6045 90.4567 13.549C90.9017 13.1045 89.8457 13.1601 89.7907 13.2156ZM78.1237 13.8823C79.6297 14.5653 80.4387 14.7082 82.1237 14.8823C80.6177 14.1993 79.8087 14.0564 78.1237 13.8823ZM124.124 14.8823C124.217 19.363 125.477 23.4674 125.95 27.8823C126.67 34.5971 126.541 41.2524 128.124 47.8823H123.124V49.8823C125.009 49.8204 127.779 50.1033 129.008 48.2789C130.509 46.0509 129.165 41.3594 128.842 38.8823C127.81 30.9538 126.289 22.8795 126.124 14.8823H124.124ZM132.457 16.549C132.402 16.6045 132.346 17.6601 132.791 17.2156C132.846 17.1601 132.902 16.1045 132.457 16.549ZM108.124 16.8823C108.124 22.9457 107.286 28.857 107.139 34.8823C107.051 38.458 107.964 42.9547 106.962 46.4039C106.349 48.5146 104.291 50.0773 103.124 51.8823C105.076 52.3933 105.581 52.6153 107.124 53.8823L118.124 50.8823C118.249 46.9482 119.452 44.3647 121.124 40.8823H116.124C115.938 47.1005 113.253 50.4293 107.124 51.8823C110.737 44.9385 109.124 35.5312 109.124 27.8823C109.124 24.1799 109.565 20.3169 108.124 16.8823ZM118.124 19.8823V30.8823C119.656 27.4703 119.964 23.6127 120.124 19.8823H118.124ZM34.1237 20.8823C36.6729 22.5668 39.1164 23.3637 42.1237 23.8823V27.8823H44.1237C43.2232 22.6474 38.9184 21.601 34.1237 20.8823ZM80.1237 20.8823V24.8823H72.1237V33.8823H74.1237V26.8823H81.1237C81.0767 24.6295 80.9977 22.9344 80.1237 20.8823ZM99.1237 21.8823C99.1237 25.1709 99.4167 28.6464 98.7337 31.8823C98.0867 34.9483 96.3377 37.6669 96.4127 40.8823C96.4927 44.2809 98.0857 47.6896 99.1237 50.8823C96.8297 50.5793 95.9117 50.3043 94.1237 48.8823C92.7607 53.8553 97.5007 53.9193 101.124 52.8823C100.318 49.3681 98.5527 45.5315 98.8937 41.8823C99.5527 34.8411 103.234 28.7442 99.1237 21.8823ZM88.1237 22.8823V34.8823H90.1237C90.1387 30.5209 91.1437 27.0507 92.1237 22.8823H88.1237ZM133.457 24.549C133.402 24.6045 133.346 25.6601 133.791 25.2156C133.846 25.1601 133.902 24.1045 133.457 24.549ZM62.1237 24.8823C63.3042 30.0988 61.4967 32.4284 59.1237 36.8823C66.4795 36.4748 68.2607 29.1645 62.1237 24.8823ZM54.1237 36.8823L57.1237 26.8823C51.9166 28.527 51.8518 32.4862 54.1237 36.8823ZM117.124 31.8823V35.8823C117.834 34.1228 117.834 33.6418 117.124 31.8823ZM33.1237 33.8823C36.5978 35.3441 39.8951 34.4447 42.1237 37.8823C42.9027 36.1132 43.0361 34.8464 43.1237 32.8823C39.6685 32.8918 36.4916 33.0803 33.1237 33.8823ZM80.1237 34.8823V38.8823C72.6011 38.9714 72.129 41.962 72.1237 48.8823C73.8832 46.5745 74.0409 44.79 74.1237 41.8823L81.1237 40.8823C81.0767 38.6295 80.9977 36.9344 80.1237 34.8823ZM63.1237 39.8823C63.1237 49.2878 62.1354 56.8833 51.1237 57.8823V59.8823C54.8031 59.8493 58.7142 59.8013 61.8961 57.6543C67.5223 53.8563 66.8562 44.576 63.1237 39.8823ZM89.1237 39.8823C87.6787 45.952 86.7837 50.2363 84.1237 55.8823L90.1237 54.8823C90.1237 50.0653 90.9997 44.3537 89.1237 39.8823ZM50.1237 41.8823C51.9991 44.2056 54.1999 44.476 57.1237 44.8823C54.9176 43.0654 52.9258 42.4885 50.1237 41.8823ZM160.791 42.2156C160.346 42.6601 161.402 42.6045 161.457 42.549C161.902 42.1045 160.846 42.1601 160.791 42.2156ZM52.1237 45.8823V51.8823C54.4634 50.0963 54.5422 48.7528 54.1237 45.8823H52.1237ZM171.124 46.8823C171.218 49.0872 171.48 50.7763 172.124 52.8823H162.124V62.8823H164.124V54.8823C170.662 54.8233 173.043 53.6733 173.124 46.8823H171.124ZM80.1237 49.8823C77.6737 56.1063 68.3879 51.9823 67.1237 57.8823C71.766 57.0073 76.3987 56.0853 81.1237 55.8823C81.0767 53.6293 80.9977 51.9343 80.1237 49.8823ZM143.124 51.8823V82.8823H146.124V51.8823H143.124ZM111.124 55.8823C111.673 65.1423 111.128 74.5953 111.124 83.8823C111.122 88.9093 111.589 93.2233 106.124 94.8823V96.8823C108.37 96.8273 111.506 97.1153 113.096 95.1403C115.168 92.5663 114.124 86.9633 114.124 83.8823V55.8823H111.124ZM134.124 56.8823C134.057 62.8993 130.528 67.1173 130.124 72.8823C136.28 70.5343 138.016 62.0193 134.124 56.8823ZM102.124 57.8823C100.419 63.2793 95.9857 60.8783 93.1517 64.4853C91.5077 66.5763 92.1257 70.4013 92.1237 72.8823H95.1237V64.8823C100.951 64.8293 103.914 64.2013 104.124 57.8823H102.124ZM122.124 58.8823V69.8823H124.124C124.138 65.7813 124.203 62.9423 127.124 59.8823C125.323 59.3203 124.002 59.0583 122.124 58.8823ZM6.79036 64.2153C6.34586 64.6603 7.40146 64.6043 7.45696 64.5493C7.90146 64.1043 6.84586 64.1603 6.79036 64.2153ZM82.1237 63.8823C82.1237 68.4553 82.6237 73.3713 81.7837 77.8823C81.2777 80.6013 79.7227 83.1003 79.5717 85.8823C79.3377 90.1783 81.7457 94.5563 82.1237 98.8823C79.1307 98.9463 77.7777 98.8283 77.1237 101.882C79.8097 101.381 82.3937 100.999 85.1237 100.882C84.2167 96.5003 81.6117 91.3583 82.0827 86.8823C82.9257 78.8703 88.0487 71.4113 82.1237 63.8823ZM170.124 63.8823C168.586 68.0643 166.426 68.7413 162.124 68.8823V79.8823H164.124V71.8823C170.036 71.3943 172.919 70.1273 173.124 63.8823H170.124ZM179.124 64.8823V70.8823C180.075 68.5973 180.075 67.1673 179.124 64.8823ZM59.1237 65.8823C59.8107 69.5823 60.1133 73.1193 60.1237 76.8823H54.1237V78.8823H62.1237C62.1107 74.1623 62.2136 69.6573 59.1237 65.8823ZM70.1237 65.8823V79.8823H72.1237C72.1243 74.8493 72.0917 71.0813 75.1237 66.8823C73.3231 66.3203 72.0018 66.0583 70.1237 65.8823ZM38.1237 66.8823C36.3465 72.8943 37.1237 79.6433 37.1237 85.8823C37.1237 92.1213 36.3465 98.8703 38.1237 104.882C34.7605 105.507 31.5455 105.854 28.1237 105.882V107.882L39.1237 106.882V80.8823C39.1237 76.3473 39.8924 71.0973 38.1237 66.8823ZM26.1237 67.8823L30.1237 98.8823H32.1237C31.6751 88.4353 29.4381 78.2283 28.1237 67.8823H26.1237ZM47.1237 96.8823H49.1237C49.1237 87.2253 47.8896 77.7023 52.1237 68.8823C46.9065 69.7533 47.1333 73.1953 47.1237 77.8823V96.8823ZM11.1237 69.8823V108.882C8.13026 108.946 6.77806 108.828 6.12366 111.882L14.1237 110.882V69.8823H11.1237ZM20.1237 73.8823C20.2135 84.7253 20.764 96.1233 22.1237 106.882H17.1237V109.882H24.1237C24.1237 97.7803 22.1237 85.9473 22.1237 73.8823H20.1237ZM101.124 73.8823V78.8823C98.8917 78.8903 95.6077 78.4143 93.7267 79.9103C90.2977 82.6373 92.1457 88.9513 95.1237 90.8823V81.8823L104.124 80.8823V73.8823H101.124ZM121.124 75.8823C121.749 79.2453 122.096 82.4603 122.124 85.8823H124.124C124.168 81.9233 124.95 78.6443 126.124 74.8823C124.246 75.0583 122.925 75.3203 121.124 75.8823ZM134.124 75.8823C133.987 82.4653 132.712 87.9113 126.534 91.2483C123.067 93.1203 119.367 92.4213 117.124 95.8823C121.556 95.3213 127.157 95.2493 131.016 92.7923C136.393 89.3693 137.554 80.9033 134.124 75.8823ZM171.124 80.8823V85.8823C166.87 85.8823 158.19 84.9053 157.124 89.8823L173.124 87.8823V80.8823H171.124ZM152.124 83.8823V88.8823L138.124 89.8823V92.8823C143.834 92.4313 149.379 91.0013 155.124 90.8823V83.8823H152.124ZM71.1237 84.8823C69.919 88.9583 71.1391 93.8103 69.5249 97.6583C68.6447 99.7573 66.409 101.058 65.1237 102.882C67.9082 102.824 70.4145 102.53 73.1237 101.882C72.4499 96.5513 73.1705 89.7603 71.1237 84.8823ZM60.1237 87.8823C59.972 95.0053 54.2044 108.487 45.1237 101.882C43.7612 107.948 54.7827 105.937 57.7333 103.792C62.674 100.201 62.1231 93.2533 62.1237 87.8823H60.1237ZM101.124 89.8823C101.218 92.0873 101.48 93.7763 102.124 95.8823L86.1237 96.8823C89.9907 102.239 98.4337 98.1273 104.124 97.8823C104.082 94.3083 104.12 92.0423 101.124 89.8823ZM145.791 98.2153C145.346 98.6603 146.402 98.6043 146.457 98.5493C146.902 98.1043 145.846 98.1603 145.791 98.2153ZM138.124 98.8823C139.372 99.5673 139.672 99.6313 141.124 99.8823C139.876 99.1973 139.576 99.1333 138.124 98.8823ZM111.791 103.215C111.346 103.66 112.402 103.604 112.457 103.549C112.902 103.104 111.846 103.16 111.791 103.215ZM97.7907 105.215C97.3457 105.66 98.4017 105.604 98.4567 105.549C98.9017 105.104 97.8457 105.16 97.7907 105.215ZM90.7907 106.215C90.3457 106.66 91.4017 106.604 91.4567 106.549C91.9017 106.104 90.8457 106.16 90.7907 106.215ZM84.7907 107.215C84.3457 107.66 85.4017 107.604 85.4567 107.549C85.9017 107.104 84.8457 107.16 84.7907 107.215ZM52.7904 112.215C52.3459 112.66 53.4015 112.604 53.457 112.549C53.9015 112.104 52.8459 112.16 52.7904 112.215ZM33.7904 114.215C33.3459 114.66 34.4015 114.604 34.457 114.549C34.9015 114.104 33.8459 114.16 33.7904 114.215ZM20.1237 115.882C21.372 116.567 21.6721 116.631 23.1237 116.882C21.8753 116.197 21.5753 116.133 20.1237 115.882Z"
        fill="#E6755F"
      />
    </svg>
  );
});

// the "start" comes in the form of "dd:dd:dd"
function getSeconds(start: string) {
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
