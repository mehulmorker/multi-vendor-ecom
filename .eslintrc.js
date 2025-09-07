module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json', './services/*/tsconfig.json', './libs/*/tsconfig.json'],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    'libs/shared/prisma/generated/**',
    'services/*/dist/**',
    'libs/*/dist/**',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          '{}': false, // Allow empty object type, common in NestJS DTOs or generics
          Function: false, // Allow Function type if explicitly needed
          Object: false, // Allow Object type if explicitly needed
        },
        extendDefaults: true,
      },
    ],
  },
};
