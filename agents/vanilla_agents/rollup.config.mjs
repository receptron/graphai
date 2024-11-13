import pluginTypescript from "@rollup/plugin-typescript";
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from "@rollup/plugin-node-resolve";

export default [{
  input: './src/index.ts',
  output: {
    file: './lib/bundle.min.mjs',
    format: 'esm',
    sourcemap: true,
  },
  external: ['graphai'],

  plugins: [
    resolve(),
    commonjs(),
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
  external: ['graphai'],
  plugins: [
    resolve(),
    commonjs(),
    pluginTypescript(),
  ],
}];
