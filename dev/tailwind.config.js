/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#a855f7',
          700: '#9333ea',
        }
      },
      backgroundColor: {
        'primary-600': '#a855f7',
        'primary-700': '#9333ea',
        'white-10': 'rgba(255, 255, 255, 0.1)',
        'white-15': 'rgba(255, 255, 255, 0.15)',
        'white-20': 'rgba(255, 255, 255, 0.2)',
      },
      textColor: {
        'white-60': 'rgba(255, 255, 255, 0.6)',
        'white-40': 'rgba(255, 255, 255, 0.4)',
        'white-80': 'rgba(255, 255, 255, 0.8)',
      },
      borderColor: {
        'white-10': 'rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}

