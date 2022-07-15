/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: { node: true },
  extends: ['rational', 'rational/warn', 'rational/prettier'],
  ignorePatterns: ['node_modules', 'lib', 'out', 'dist'],
  overrides: [
    {
      files: ['*.mjs'],
      parserOptions: { sourceType: 'module' },
    },
    {
      files: ['*.js'],
      parserOptions: { sourceType: require('./package.json').type === 'module' ? 'module' : 'script' },
    },
    {
      env: { node: false },
      extends: ['rational/react', 'rational/typescript', 'rational/prettier'],
      files: ['*.ts', '*.tsx'],
      parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
    },
  ],
  root: true,
};
