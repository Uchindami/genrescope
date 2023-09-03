const defaultTheme = require("tailwindcss/defaultTheme");
const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter var", ...defaultTheme.fontFamily.sans],
                mono: ["Fira Code VF", ...defaultTheme.fontFamily.mono],
            },
        },
        colors: {
            "primary-body": "hsla(0, 0%, 16%, 1)",
            "secondary": "hsla(0, 0%, 100%, 1)",
            "accent": "#635994",
            "button-fill": "hsl(163,70%,40%)",
            "hover": "hsla(162, 72%, 37%, 1)",
            "headings-lrg": "hsl(0,0%,100%)",
            "headings-mid": "hsl(0,0%,87%)",
            "headings-sm": "hsla(162, 72%, 37%, 1)",
        },
    },
    plugins: [],
  });