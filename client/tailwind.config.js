/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        'main-blue': '#1799E5',
        'strong-yellow': '#FFE34F',
        'subtle-yellow': '#FEF521',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(10px)' },
        },
      },
    },
  },
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('tailwindcss'), require('autoprefixer')],
};
