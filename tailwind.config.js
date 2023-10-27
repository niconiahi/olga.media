/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        seriaIncreible: "#6F49A0 2px 4px 0px 0px",
        soneQueVolaba: "#006BA6 2px 4px 0px 0px",
        brandBlue: "#015FA0 2px 4px 0px 0px",
      },
      colors: {
        brand: {
          blue: "#015FA0",
          blueHover: "#B3E0FF",
          red: "#FF0044",
          redHover: "#FFB2C7",
          stone: "#F2F2F2",
        },
        show: {
          seriaIncreible: {
            yellow: "#F8C552",
            purple: "#6F49A0",
            purpleHover: "#D7CAE7",
          },
          soneQueVolaba: {
            blue: "#006BA6",
            blueHover: "#B2E4FF",
            orange: "#FF9600",
          },
        },
      },
    },
  },
  plugins: [],
};
