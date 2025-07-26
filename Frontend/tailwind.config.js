/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cambria: ["Cambria", "serif"],
        lobster: ['Lobster', 'cursive']
      },
      colors: {
        beige: "#F7F5E8",  // Svetlo bež
        dark: "#07090D",      // Varijanta crne
        green: "#669676",     // Skoro bela
        accent: "#D4A373",    // Tamno crvena
        orange: "#C56D43"
      }
    },
  },
  corePlugins: {
    animation: true,
  },
  variants: {
    extend: {
      animation: ['group-hover'],
    },
  },
  plugins: [],
}

