import type { Config } from '@react-router/dev/config'

export default {
	appDirectory: 'client',
	ssr: false,
	prerender: ['/', '/splash'],
} satisfies Config
