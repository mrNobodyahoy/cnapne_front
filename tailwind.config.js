/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 👇 Substitua o objeto 'colors' inteiro por este
      colors: {
        'ifpr-green': '#34864A',         // Verde do logo
        'ifpr-red': '#E31C29',           // Vermelho do logo
        'ifpr-black': '#231F20',         // Preto/grafite do logo
      },
    },
  },
  plugins: [],
}