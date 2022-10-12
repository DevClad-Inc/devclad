module.exports = {
	...require('@devclad/config/eslint-react'),
	...require('@remix-run/eslint-config'),
	...require('@remix-run/eslint-config/node'),
	ignorePatterns: ['**/*.js', '**/*.cjs', '**/*.json', 'node_modules'],
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
