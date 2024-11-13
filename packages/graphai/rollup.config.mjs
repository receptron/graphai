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
},{
  input: './src/index.ts',
  output: {
    name: 'graphai',
    file: './lib/bundle.umd.mjs',
    format: 'umd',
    sourcemap: true,
  },

  plugins: [
    pluginTypescript(),
  ],
}];
