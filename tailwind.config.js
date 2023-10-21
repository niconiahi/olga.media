/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#015fa0",
          red: "#ff0044",
        },
        show: {
          seriaIncreible: {
            yellow: "#f8c552",
            purple: "#6f49a0",
            purpleHover: "hsl(266 37% 46% / 20%)",
          },
          soneQueVolaba: {
            blue: "#006ba6",
            blueHover: "hsl(201 100% 33% / 20%)",
            orange: "#ff9600",
          },
        },
      },
    },
  },
  plugins: [],
};
