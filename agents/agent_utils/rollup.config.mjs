import pluginTypescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default [
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/bundle.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    external: ["graphai"],
    plugins: [commonjs({ ignore: ["graphai"] }), pluginTypescript()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/bundle.cjs.min.js",
      format: "cjs",
      sourcemap: true,
    },
    external: ["graphai"],
    plugins: [commonjs({ ignore: ["graphai"] }), pluginTypescript(), terser()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/bundle.esm.js",
      format: "esm",
      sourcemap: true,
    },
    external: ["graphai"],
    plugins: [resolve(), pluginTypescript()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/bundle.esm.min.js",
      format: "esm",
      sourcemap: true,
    },
    external: ["graphai"],
    plugins: [resolve(), pluginTypescript(), terser()],
  },
  {
    input: "./src/index.ts",
    output: {
      name: "agent_utils",
      file: "./lib/bundle.umd.js",
      format: "umd",
      sourcemap: true,
      globals: {
        graphai: "graphai",
      },
    },
    external: ["graphai"],
    plugins: [commonjs({ ignore: ["graphai"] }), pluginTypescript()],
  },
];
