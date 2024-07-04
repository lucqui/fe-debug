/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens:{
        // MAX WIDTH
        // Extra Extra Large Screens
        '2xlM': {'max': '1360px'},
        // => @media (max-width: 1535px) { ... }

        // Extra Large Screens
        'xlM': {'max': '1279px'},
        // => @media (max-width: 1279px) { ... }

        // Large Screens
        'lgM': {'max': '1023px'},
        // => @media (max-width: 1023px) { ... }

        // Medium Large Screens
        'mgM': {'max': '1000px'},

        // Medium Screens
        'mdM': {'max': '767px'},
        // => @media (max-width: 767px) { ... }

        // Small Medium Screens
        'smM': {'max': '639px'},
        // => @media (max-width: 639px) { ... }

        // Tiny Small Screens
        'tsM': {'max':'520px'},

        // Extra Small Screens
        'xsM': {'max': '430px'},

        // Zero Small Screens
        'zsM': {'max':'408px'}
      }
    },
  },
  plugins: [],
}