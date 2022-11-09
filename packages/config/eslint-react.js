module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: [
		'plugin:react/recommended',
		'airbnb',
		'airbnb-typescript',
		'plugin:@typescript-eslint/recommended',
		'turbo',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['react', '@typescript-eslint', 'prettier', 'react-hooks'],
	rules: {
		'prettier/prettier': ['error'],
		'react-hooks/exhaustive-deps': 'warn',
		'react-hooks/rules-of-hooks': 'error',
		'react/jsx-boolean-value': 'off',
		'react/jsx-indent-props': [2, 'tab'],
		'react/jsx-indent': [2, 'tab'],
		'react/jsx-one-expression-per-line': [0],
		'react/prefer-stateless-function': [1],
		'react/static-property-placement': [1, 'property assignment'],
		'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
		'import/prefer-default-export': 'off',
		'@typescript-eslint/no-shadow': ['error', { ignoreTypeValueShadow: true }],
		'no-shadow': 'off',
		'@typescript-eslint/naming-convention': 'warn',
		'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
		'no-restricted-syntax': [
			'error',
			{
				selector: 'ForInStatement',
				message:
					'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
			},
			{
				selector: 'LabeledStatement',
				message:
					'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
			},
			{
				selector: 'WithStatement',
				message:
					'`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
			},
		],
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['error'],
		'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', 'ts', 'tsx'] }],
		'jsx-a11y/label-has-associated-control': [
			'error',
			{
				controlComponents: ['Field', 'input'],
				assert: 'both',
			},
		],
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				'': 'never',
				js: 'never',
				jsx: 'never',
				ts: 'never',
				tsx: 'never',
			},
		],
	},
};
