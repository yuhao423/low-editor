/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mimi: "#8769ff", // 自定义主色（可选）
      },
    },
  },
  plugins: [],
}
