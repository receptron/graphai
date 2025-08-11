import eslintBase from "../../config/eslint.config.base.mjs";

export default [
  {
    files: ["{src,test,samples}/**/*.{js,ts,yaml,yml,json}"],
  },
  {
    ignores: ["lib/**/*", "*.ts", "apiDoc/**/*", "dist/*"],
  },
  ...eslintBase,
];
