/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'star': ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'holo': '#6be5ff',
        'saber-green': '#34ffb9',
        'saber-blue': '#35e0ff',
      },
      boxShadow: {
        'holo': '0 0 20px rgba(0, 195, 255, 0.6)',
        'saber-green': '0 0 16px rgba(0, 255, 170, 0.9)',
        'saber-blue': '0 0 16px rgba(0, 200, 255, 0.9)',
      }
    },
  },
  plugins: [],
}
