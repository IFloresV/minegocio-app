/** @type {import('tailwindcss').Config} */
module.exports = {
   // NOTE: Update this to include the paths to all of your component files.
   content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
   presets: [require("nativewind/preset")],
   theme: {
      extend: {
         colors: {
            mn: {
               base: "#DE1916",
               primary: "#16A5DE",
               secondary: "#3716DE",
               fc: "#FFFFFF",

               dark: "#1e1b4b",
               light: "#f8fafc",
            },
         },
         fontFamily: {
            inter: ["Inter-Regular"],
            "inter-bold": ["Inter-Bold"],
            "inter-light": ["Inter-Light"],
            "inter-italic": ["Inter-Italic"],
         },
      },
   },
   plugins: [],
};
