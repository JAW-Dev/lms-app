/* eslint-disable */
module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss")("./tailwind.js"),
    require("postcss-flexbugs-fixes"),
    require("postcss-preset-env")({
      autoprefixer: {
        flexbox: "no-2009",
        grid: "autoplace",
      },
      stage: 3,
    }),
    require("postcss-hexrgba"),
  ],
};
