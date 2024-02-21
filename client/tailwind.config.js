/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        'main-blue': '#1799E5',
        'strong-yellow': '#FFE34F',
        'subtle-yellow': '#FEF521',
        'subtle-blue': '#BBE2EC',
        'strong-blue': '#7EC7D',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(10px)' },
        },
        beat: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.2)' },
          '60%': { transform: 'scale(1)' },
        },
      },
      animation: {
        beat: 'beat 0.5s 0.2s infinite forwards',
      },
    },
  },
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('tailwindcss'), require('autoprefixer')],
};
