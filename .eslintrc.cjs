/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: { node: true },
  extends: ['rational', 'rational/warn', 'rational/prettier'],
  ignorePatterns: ['node_modules', 'lib', 'out', 'dist', '*.config.js', '*.config.cjs', '*rc.js', '*rc.cjs'],
  overrides: [
    {
      files: ['*.cjs'],
      parserOptions: { sourceType: 'script' },
    },
    {
      files: ['*.mjs'],
      parserOptions: { sourceType: 'module' },
    },
    {
      files: ['*.js'],
      parserOptions: { sourceType: require('./package.json').type === 'module' ? 'module' : 'script' },
    },
    {
      extends: ['rational/react', 'rational/prettier'],
      files: ['*.jsx', '*.tsx'],
    },
    {
      extends: ['rational/typescript', 'rational/prettier'],
      files: ['*.ts', '*.tsx'],
      parserOptions: { project: `${__dirname}/tsconfig.json` },
    },
  ],
  root: true,
};
