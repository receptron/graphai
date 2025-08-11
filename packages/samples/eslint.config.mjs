import eslintBase from "../../config/eslint.config.base.mjs";

export default [
  {
    files: ["{src,test,samples}/**/*.{js,ts,json}"],
  },
  {
    ignores: ["lib/**/*", "*.ts", "apiDoc/**/*"],
  },
  ...eslintBase,
];
