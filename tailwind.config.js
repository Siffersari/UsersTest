/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kcbDarkBlue: '#013B4C',
        kcbLightGray: '#FBFBFB',
        kcbWhite: '#FFFFFF',
        kcbGreen: '#80BC00',
        kcbTeal: '#0C5045',
      },
    },
  },
  plugins: [],
}
