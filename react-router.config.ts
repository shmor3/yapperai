import type { Config } from '@react-router/dev/config'

export default {
	appDirectory: 'client',
	ssr: false,
	prerender: ['/'],
} satisfies Config
