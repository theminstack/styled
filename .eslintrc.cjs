/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.js', '*.cjs'],
      parserOptions: { ecmaVersion: 2020, sourceType: 'script' },
      env: { node: true, es2021: true },
      rules: {
        'no-undef': 'off',
        'import/no-extraneous-dependencies': 'warn',
      },
      extends: ['eslint:recommended', 'plugin:import/recommended', 'plugin:prettier/recommended'],
    },
    {
      files: ['*.mjs'],
      parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
      env: { node: true, es2021: true },
      rules: {
        'no-undef': 'off',
        'import/no-extraneous-dependencies': 'warn',
      },
      extends: ['eslint:recommended', 'plugin:import/recommended', 'plugin:prettier/recommended'],
    },
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
      settings: { react: { version: 'detect' } },
      rules: {
        'import/no-extraneous-dependencies': [
          'warn',
          { devDependencies: ['**/*.test.ts', '**/*.test.tsx', '**/__*/**'] },
        ],
        'import/no-default-export': 'warn',
        'import/prefer-default-export': 'off',
        'import/extensions': ['warn', 'never', { json: 'always', png: 'always' }],
        'import/exports-last': 'warn',
        'import/group-exports': 'warn',
        'import/order': 'off',
        'simple-import-sort/imports': 'warn',
        'simple-import-sort/exports': 'warn',
        '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
        '@typescript-eslint/method-signature-style': 'warn',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/consistent-type-imports': 'warn',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
      plugins: ['simple-import-sort', 'only-warn'],
      extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
      ],
    },
  ],
  ignorePatterns: ['node_modules', 'lib', 'out', 'dist'],
};
