/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ['no-secrets'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    react: {
      version: 'latest',
    },
  },
  rules: {
    'no-unreachable': 'error',
    'no-secrets/no-secrets': ['error', { tolerance: 4.1 }],
    'import/no-self-import': 'error',
    'import/no-cycle': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-deprecated': 'error',
    'import/no-mutable-exports': 'error',
    'import/first': 'error',
    'import/no-namespace': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'object', 'index'],
        alphabetize: { order: 'asc', caseInsensitive: false },
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-default-export': 'error',
    'import/no-anonymous-default-export': 'error',
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_', args: 'all', caughtErrors: 'all' },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      { allowNullableObject: false, allowNullableString: true, allowNullableBoolean: true, allowNullableNumber: true },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    'prettier/prettier': 'warn',
  },
  ignorePatterns: ['node_modules', 'lib', 'out', '**/*.js'],
};
