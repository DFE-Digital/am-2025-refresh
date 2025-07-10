module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'prettier',
    ],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': 'error',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-console': 'warn',
        'prefer-const': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'prefer-template': 'error',
    },
    ignorePatterns: [
        'node_modules/',
        'app/public/',
        '*.min.js',
        'consolidated.*.js',
    ],
};