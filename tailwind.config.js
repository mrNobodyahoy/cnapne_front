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
        'ifpr-green': '#16a34a', // Use o código HEX da sua cor principal
        'ifpr-green-dark': '#15803d', // Use o código HEX para a cor mais escura no hover
      },
    },
  },
  plugins: [],
}