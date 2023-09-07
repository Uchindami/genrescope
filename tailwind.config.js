const defaultTheme = require("tailwindcss/defaultTheme");
const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                colfaxAIRegular: ["ColfaxAIRegular","cursive"],
                colfaxAIBold: ["ColfaxAIBold", "mono"]
            },
        },
        colors: {
            "primary-body": "hsla(0, 0%, 16%, 1)",
            "primary-body-light": "#FFF3E1",
            "headings-light": "#2F272A",
            "secondary": "hsla(0, 0%, 100%, 1)",
            "accent": "#1DBDBB",
            "button-fill": "#1DBDBB",
            "hover": "hsla(162, 72%, 37%, 1)",
            "headings-lrg": "hsl(0,0%,100%)",
            "headings-mid": "hsl(0,0%,87%)",
            "headings-sm": "#FE0000",

        },
    },
    plugins: [],
  });