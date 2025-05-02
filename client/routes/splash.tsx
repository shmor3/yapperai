import { Container } from '@client/components/container'
import { Splash } from '@client/components/splash'
import { Content } from '@client/partials/content'
// import { useEffect } from 'react'
import type { Route } from '@rr/routes/+types/splash'

export default function Component({ loaderData }: Route.ComponentProps) {
	if (loaderData.ready) {
		console.log('ok')
		// useEffect(() => {
		// 	setTimeout(() => invoke('close_splash'), 2000)
		// }, [])
	}
	return (
		<main className='flex flex-col justify-center items-center min-h-screen w-full fixed inset-0 bg-base-100'>
			<Splash />
		</main>
	)
}

export async function loader() {
	return { ready: true }
}
