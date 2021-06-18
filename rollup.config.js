import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: 'lib/esm.js', format: 'esm' },
      { file: 'lib/cjs.js', format: 'cjs' },
    ],
    external: ['react'],
    plugins: [resolve(), commonjs(), typescript(), json(), terser()],
  },
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'lib/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
