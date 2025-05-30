const { constants } = require('jest-config')

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
	prettierPath: null,
	setupFilesAfterEnv: ['<rootDir>/scripts/jest-utils/setup'],
	transform: {
		[constants.DEFAULT_JS_PATTERN]: 'babel-jest',
		'^.+\\.vue$': '@vue/vue3-jest',
		'^.+\\.svelte$': [
			'svelte-jester',
			{
				preprocess: true,
				rootMode: 'upward',
			},
		],
	},
	resolver: '<rootDir>/scripts/jest-resolver.js',
	globals: {
		'vue-jest': {
			transform: {
				'^typescript$': 'babel-jest',
				'^tsx?$': 'babel-jest',
			},
		},
	},
	watchPlugins: [
		'jest-watch-typeahead/filename',
		'jest-watch-typeahead/testname',
	],
	testEnvironment: 'jsdom',
}
