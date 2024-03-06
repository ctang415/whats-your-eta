/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./src/**/*.{js,jsx,ts,tsx}", "./index.html", "./src/**/*.{html,js}"],
  theme: {
    screens: {
      'xl': {'min': '1024px', 'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'min': '768px', 'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'min': '640px', 'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
    },
      extend: {},
  },
  plugins: [],
}

