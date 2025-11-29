 to module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules', 'android', 'ios', 'build'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Allow unused vars that are a single underscore or ALL CAPS constants
    // varsIgnorePattern matches:
    // - Underscore alone: _
    // - All caps/underscores: API_KEY, CONSTANT, MY_CONST, etc.
    // Note: Does NOT match underscore-prefixed variables like _foo or _myVar
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^(_|[A-Z_]+)$',
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    // Allow empty catch blocks with comment
    'no-empty': ['error', { allowEmptyCatch: true }],
    // Relax some React hooks rules for this project
    'react-hooks/exhaustive-deps': 'warn',
    // Allow console in development
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // Allow process global
    'no-undef': ['error', { typeof: true }],
  },
  globals: {
    process: 'readonly',
    global: 'readonly',
  },
}

