/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          DEFAULT: "#0A0A0A",
          200: "#3A3A3A",
          300: "#CECECE",
        },
        blue: {
          DEFAULT: "#1474D4",
        },
        red: {
          DEFAULT: "#FE4949",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
        sthin: ["LeagueSpartan-Thin", "sans-serif"],
        sextralight: ["LeagueSpartan-ExtraLight", "sans-serif"],
        slight: ["LeagueSpartan-Light", "sans-serif"],
        sregular: ["LeagueSpartan-Regular", "sans-serif"],
        smedium: ["LeagueSpartan-Medium", "sans-serif"],
        ssemibold: ["LeagueSpartan-SemiBold", "sans-serif"],
        sbold: ["LeagueSpartan-Bold", "sans-serif"],
        sextrabold: ["LeagueSpartan-ExtraBold", "sans-serif"],
        sblack: ["LeagueSpartan-Black", "sans-serif"],
      },
    },
    plugins: [],
  },
};
