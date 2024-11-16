import pluginTypescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/bundle.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    plugins: [pluginTypescript(), commonjs(), terser()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/bundle.esm.js",
      format: "esm",
      sourcemap: true,
    },

    plugins: [pluginTypescript()],
  },
  {
    input: "./src/index.ts",
    output: {
      name: "graphai_agent_filters",
      file: "./lib/bundle.umd.js",
      format: "umd",
      sourcemap: true,
    },

    plugins: [pluginTypescript(), terser()],
  },
];
