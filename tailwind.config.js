/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx", 
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#FDCC00',
        primaryLight: '#ffe141',
        secondary: '#490D83',
        text: '#363636',
        disabled: '#9197a6',
        border: '#d0d4dc',
        backgroundPrimary: '#FFFFFF',
        backgroundSecondary: '#8152f7',
        backgroundDark: '#1a1a1a',
        backgroundLight: '#fafafa',
      },
    },
  },
  plugins: [],
}