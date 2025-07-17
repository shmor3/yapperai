import { Splash } from '@client/components/splash'
import type { Route } from '@rr/routes/+types/splash'

export default function Component({ loaderData }: Route.ComponentProps) {
	return (
		<main className='flex flex-col justify-center items-center min-h-screen w-full bg-base-100'>
			<Splash />
		</main>
	)
}

export async function loader() {
	return { ready: true }
}
