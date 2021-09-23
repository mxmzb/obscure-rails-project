module.exports = {
  mode: "jit",
  purge: [
    "./app/views/**/*.html.erb",
    "./app/helpers/**/*.rb",
    "./app/javascript/**/*.js",
    "./app/javascript/**/*.jsx",
  ],
  plugins: [require("tailwindcss")],
};
