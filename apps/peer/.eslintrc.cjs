module.exports = {
	...require('@devclad/config/eslint-react'),
	ignorePatterns: ['**/*.js', '**/*.cjs', '**/*.json', 'node_modules', 'dist'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
	},
};
