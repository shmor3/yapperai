module.exports = {
	assumptions: {
		constantReexports: true,
		setClassMethods: true,
		setComputedProperties: true,
		setPublicClassFields: true,
		setSpreadProperties: true,
	},
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 18,
				},
				exclude: ['@babel/plugin-proposal-optional-chaining'],
			},
		],
		['@babel/preset-react', { runtime: 'automatic' }],
		[
			'@babel/preset-typescript',
			{ isTSX: true, allExtensions: true, disallowAmbiguousJSXLike: true },
		],
	],
	overrides: [
		{
			test: /\.svelte$/,
			presets: [
				[
					'@babel/preset-typescript',
					{
						isTSX: true,
						allExtensions: true,
						disallowAmbiguousJSXLike: true,
						onlyRemoveTypeImports: true,
					},
				],
			],
		},
		{
			test: /\/xstate-solid\/|solid\.test\.tsx$/,
			presets: ['babel-preset-solid'],
		},
	],
	plugins: ['@babel/proposal-class-properties'],
}
