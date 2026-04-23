/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E2A78',
          dark: '#141C52',
          light: '#2F3F9A',
        },
        secondary: {
          DEFAULT: '#5F6785',
          light: '#95A0BF',
          dark: '#414A67',
        },
        accent: {
          DEFAULT: '#C08A2B',
          light: '#D3A24A',
          dark: '#9A6C1D',
        },
        'dark-green': '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        bold: '700',
      },
    },
  },
  plugins: [],
}

