/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          50: '#f0edd9',
          100: '#e8e6d9',
          200: '#d4d2c0',
          300: '#c8c6b8',
          400: '#9fc99f',
          500: '#8fbc8f',
          600: '#6b9b6b',
          700: '#4a7c4a',
          800: '#2a3b2c',
          900: '#1a2520',
          950: '#1a2f1c',
        },
      },
      fontFamily: {
        serif: ['Spectral', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
