import { Container } from '@client/components/container'
import { Content } from '@client/partials/content'
import { Footer } from '@client/partials/footer'
import { Header } from '@client/partials/header'
import { Sidebar } from '@client/partials/sidebar'
import { Items } from '@client/partials/sidebar/items'
import { useBearContext } from '@state/bears'
import type { Route } from '@rr/routes/+types/source'
import { TitleBar } from '@client/components/titlebar'
// import { trayMenu } from '@client/components/tray'
// import { useEffect } from 'react'

export default function Component({ loaderData }: Route.ComponentProps) {
	const { activeTab } = useBearContext()
	if (loaderData.ready) {
		console.log('ok')
	}
	const ActiveComponent = Items[activeTab]?.component || Items[0].component
	// useEffect(() => {
	// 	trayMenu()
	// 	return () => {}
	// }, [])
	return (
		<main className='flex flex-col'>
			<TitleBar />
			<Container size='lg'>
				<Header />
				<Sidebar />
				<Content>
					<ActiveComponent />
				</Content>
				<Footer />
			</Container>
		</main>
	)
}

export async function loader() {
	return { ready: true }
}
