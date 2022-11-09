module.exports = {
	...require('@devclad/config/eslint-react'),
	ignorePatterns: ['**/*.js', '**/*.cjs', '**/*.json', 'node_modules', 'vite.config.ts'],
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
