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
        'chat-background': '#f5f1ee',
        'sidebar': '#e8e0d8',
        'user-bubble': '#dcd3cb',
        'button-dark': '#4a3c31',
      },
    },
  },
  plugins: [],
}
