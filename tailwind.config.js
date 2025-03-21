/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0A0A0A", // Color general de fondo
          card: "#121212", // Fondo de las cards y campos específicos
        },
        white: {
          DEFAULT: "#FFFFFF", // Texto principal
          100: "#CECECE", // Texto secundario 
          200: "#3A3A3A", // Texto ter
          
        },
        primary: {
          DEFAULT: "#FE4949", // Rojo usado para acciones principales (botones)
        },
        secondary: {
          DEFAULT: "#1474D4", // Azul para elementos destacados
        },
        gray: {
          DEFAULT: "#0A0A0A", // Gris oscuro para textos
          light: "#3A3A3A", // Para botones secundarios u opciones menos destacadas
        },
        black: {
          DEFAULT: "#000000", // Color negro puro (si necesitas para algo específico)
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

// colors: {
//   primary: {
//     DEFAULT: "#0A0A0A",
//   },
//   gray: {
//     DEFAULT: "#0A0A0A",
//     200: "#3A3A3A",
//     300: "#CECECE",
//     //1d1d1d
//   },
//   blue: {
//     DEFAULT: "#1474D4",
//   },
//   red: {
//     DEFAULT: "#FE4949",
//   },
//   black: {
//     DEFAULT: "#000",
//     100: "#121212",
//     200: "#1e1e1e",
//   },
// },
