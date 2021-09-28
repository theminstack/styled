import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import versionInjector from 'rollup-plugin-version-injector';
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
    input: ['src/index.ts'],
    output: [
      { dir: 'lib/cjs', format: 'cjs', sourcemap: true },
      { dir: 'lib/esm', format: 'esm', sourcemap: true },
    ],
    external,
    plugins: [resolve(), commonjs(), typescript({ rootDir: 'src' }), json(), versionInjector(), terser()],
  },
  {
    input: ['out/index.d.ts'],
    output: [{ dir: 'lib/types', entryFileNames: (chunk) => chunk.name.replace(/\.d$/, '') + '.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];

export default config;
