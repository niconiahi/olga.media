/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#016aac',
          red: '#ff0044'
        }
      }
    },
  },
  plugins: [],
};
