import type { Config } from 'tailwindcss'

export default {
	content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				JetBrainsMono: ['JetBrainsMono', 'monospace'],
			},
		},
	},
	plugins: [
		require('daisyui'),
		require('tailwind-merge'),
		require('tailwindcss-animate'),
		require('@tailwindcss-typography'),
	],
} satisfies Config
