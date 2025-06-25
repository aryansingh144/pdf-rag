/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a', // dark navy
        secondary: '#1e293b', // slightly lighter navy
        accent: '#38bdf8', // sky blue
        edge: '#7dd3fc', // soft neon blue
      },
    },
  },
  plugins: [],
};