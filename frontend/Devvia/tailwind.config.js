/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          card: 'rgba(255, 255, 255, 0.05)',
          text: '#ffffff',
          primary: '#3b82f6',
        },
        light: {
          bg: '#f8fafc',
          card: 'rgba(0, 0, 0, 0.05)',
          text: '#0f172a',
          primary: '#2563eb',
        }
      },
      fontFamily: {
        logo: ['"Science Gothic"', 'sans-serif'],
        headings: ['Lexend', 'sans-serif'],
        body: ['Comfortaa', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}