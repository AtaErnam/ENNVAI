/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./dist/**/*.{html,js}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        sm: "2rem",
        lg: "4rem",
        xl: "2rem",
      },
    },
    fontFamily: {
      head: ["Playfair Display"],
    },
    extend: {
      spacing: {
        "10rem": "-10rem",
      },
      colors: {
        primary: "#0E1B1B",
        primaryLighter: "#213F3F",
        secondary: "#FFCC8E",
        secondaryLighter: "#FFEED9",
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin")],
};
