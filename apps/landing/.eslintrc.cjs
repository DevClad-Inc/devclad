module.exports = {
  ...require('@devclad/config/eslint-react'),
  ignorePatterns: [
    '**/*.js',
    '**/*.cjs',
    '**/*.json',
    'node_modules',
    'public',
    'dist',
    'vite.config.ts',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
