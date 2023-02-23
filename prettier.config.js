/** @type {import('prettier').Config} */
module.exports = {
  plugins: [require("prettier-plugin-tailwindcss")],
  overrides: [
    {
      files: "./pnpm-lock.yaml",
      options: {
        singleQuote: false,
      },
    },
  ],
};
