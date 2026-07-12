/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f4',
          100: '#e8ebe2',
          200: '#d2d8c6',
          300: '#b3bda1',
          400: '#95a27e',
          500: '#7a8963',
          600: '#5f6c4d',
          700: '#4b553e',
          800: '#3e4634',
          900: '#353c2e',
        },
        earth: {
          50: '#faf6f1',
          100: '#f0e6d6',
          200: '#e0ccab',
          300: '#cdac7b',
          400: '#be9258',
          500: '#b07f45',
          600: '#9a683a',
          700: '#7e5131',
          800: '#69432e',
          900: '#5a3a29',
        },
        moss: {
          50: '#f2f7f2',
          100: '#e0ece0',
          200: '#c3d9c3',
          300: '#98bc98',
          400: '#6b9b6b',
          500: '#4a7f4a',
          600: '#386538',
          700: '#2e512e',
          800: '#274227',
          900: '#213621',
        },
        cream: {
          50: '#fefcf7',
          100: '#fdf8ed',
          200: '#faf0d6',
          300: '#f5e3b3',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
