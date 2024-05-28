import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "lib/index.js",
    output: {
      name: "GraphAIVanillaAgents",
      file: "dist/bundle.umd.js",
      format: "umd",
    },
    plugins: [resolve(), commonjs()],
  },
];
