/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#005FB8", // CampusGo blue
        accent: "#10B981",  // green
      },
    },
  },
  plugins: [],
};
