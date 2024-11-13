import pluginTypescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser';

export default [{
  input: './src/index.ts',
  output: {
    file: './lib/bundle.min.mjs',
    format: 'esm',
    sourcemap: true,
  },

  plugins: [
    pluginTypescript(),
    terser(),
  ],
},{
  input: './src/index.ts',
  output: {
    file: './lib/bundle.mjs',
    format: 'esm',
    sourcemap: true,
  },

  plugins: [
    pluginTypescript(),
  ],
}];
