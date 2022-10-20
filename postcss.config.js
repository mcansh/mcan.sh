module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-100vh-fix"),
    process.env.NODE_ENV === "production" && require("cssnano"),
  ].filter(Boolean),
};
