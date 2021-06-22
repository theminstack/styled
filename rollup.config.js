import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

const external = [
  ...new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]),
];

/** @type {import('rollup').RollupOptions[]} */
const config = [
  {
    input: 'src/index.ts',
    output: [
      { file: 'lib/esm.js', format: 'esm' },
      { file: 'lib/cjs.js', format: 'cjs' },
    ],
    external,
    plugins: [resolve(), commonjs(), typescript(), json(), terser()],
  },
  {
    input: 'out/src/index.d.ts',
    output: [{ file: 'lib/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];

export default config;
