import pluginTypescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser';

export default {
  input: './src/index.ts',
  output: {
    file: './lib/bundle.js',
    format: 'esm',
    sourcemap: true,
  },

  plugins: [
    pluginTypescript(),
    terser(),
  ],
};
