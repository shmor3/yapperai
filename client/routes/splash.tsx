import { Splash } from '@client/components/splash'
import type { Route } from '@rr/routes/+types/splash'

export default function Component({ loaderData }: Route.ComponentProps) {
	if (loaderData.ready) {
		console.log('ok')
    const pluginId = 'ui'
    const pluginUrl = ''
    console.log(`Initializing plugin: ${pluginId} from URL: ${pluginUrl}`);
    invoke('init_plugins', { pluginId: pluginId, pluginUrl: pluginUrl })
	}
	return (
		<main className='flex flex-col justify-center items-center min-h-screen w-full bg-base-100'>
			<Splash />
		</main>
	)
}

export async function loader() {
	return { ready: true }
}
