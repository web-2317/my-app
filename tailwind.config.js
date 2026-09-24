/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#E7EBF0",
        accent: "#3B82F6",
        "accent-hover": "#2563EB",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Helvetica Neue",
          "Arial",
          "Hiragino Kaku Gothic ProN",
          "Hiragino Sans",
          "Meiryo",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 4px 16px rgba(15, 23, 42, 0.10), 0 1px 3px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
