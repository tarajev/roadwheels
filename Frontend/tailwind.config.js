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
        green: "#669676",     // zelena
        accent: "#D4A373",    // svetlo narandzasta
        orange: "#C56D43"     // tamnija narandzasta
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

