// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'chat-background': '#f5f5f5',
        'sidebar': '#efefed',
        'user-bubble': '#e5e6e3',
        'button-dark': '#292726',
      },
    },
  },
  plugins: [],
}
