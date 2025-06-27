/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}', // Added to support @/* alias
  ],
  theme: {
    extend: {
             fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'], // default
        dmsans: ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {

        abhi: '#FFFF00',
        customblue: ' #eefafe' // bright yellow
      },
       
      
    },
  },
  plugins: [],
};
