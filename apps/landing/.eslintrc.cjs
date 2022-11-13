module.exports = {
	...require('@devclad/config/eslint-react'),
	extends: ['next/core-web-vitals'],
	ignorePatterns: [
		'**/*.js',
		'**/*.cjs',
		'**/*.json',
		'node_modules',
		'public',
		'dist',
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
