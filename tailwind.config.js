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
          DEFAULT: '#1B365D',
          dark: '#0F2439',
          light: '#2A4A6B',
        },
        secondary: {
          DEFAULT: '#6B7280',
          light: '#9CA3AF',
          dark: '#4B5563',
        },
        accent: {
          DEFAULT: '#F97316', // Orange
          light: '#FB923C',
          dark: '#EA580C',
        },
        'dark-green': '#1F4E3D', // Dark green for top bar
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

