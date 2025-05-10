import type { Config } from '@react-router/dev/config'

export default {
	appDirectory: 'client',
	ssr: false,
	prerender: async () => {
		return ['/', '/splash']
	},
} satisfies Config
