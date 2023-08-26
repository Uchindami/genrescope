module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
      fontFamily: {
        display: ['Open Sans', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
        Inter: ["Inter", "sans-serif"],
        InterSemiBold: ["InterSemiBold", "sans-serif"],
        InterBold: ["InterBold", "sans-serif"],
      },
      extend: {
        fontSize: {
          14: '14px',
          normal: "1.125rem",
        },
        backgroundColor: {
          'main-bg': '#FAFBFB',
          'main-dark-bg': '#20232A',
          'secondary-dark-bg': '#33373E',
          'light-gray': '#F7F7F7',
          'half-transparent': 'rgba(0, 0, 0, 0.5)',
        },
        colors: {
          "primary-body": "hsla(0, 0%, 16%, 1)",
          "secondary": "hsla(0, 0%, 100%, 1)",
          "button-fill": "hsl(163,70%,40%)",
          "hover": "hsla(162, 72%, 37%, 1)",
          "headings-lrg": "hsl(0,0%,100%)",
          "headings-mid": "hsl(0,0%,87%)",
          "headings-sm": "hsla(162, 72%, 37%, 1)",
        },
        borderWidth: {
          1: '1px',
        },
        borderColor: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        width: {
          400: '400px',
          760: '760px',
          780: '780px',
          800: '800px',
          1000: '1000px',
          1200: '1200px',
          1400: '1400px',
        },
        height: {
          80: '80px',
        },
        minHeight: {
          590: '590px',
        },
        backgroundImage: {
          'hero-pattern':
            "url('https://i.ibb.co/MkvLDfb/Rectangle-4389.png')",
        },
      },
    },
    plugins: [],
  };