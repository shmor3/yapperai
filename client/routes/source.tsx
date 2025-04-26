import { Container } from '@client/components/container'
import { Content } from '@client/partials/content'
import { Footer } from '@client/partials/footer'
import { Header } from '@client/partials/header'
import { Sidebar } from '@client/partials/sidebar'
import { BearProvider } from '@client/state/bears'
import type { Route } from '@rr/routes/+types/source'
import { useState } from 'react'

export default function Component({ loaderData }: Route.ComponentProps) {
	const [active, setActive] = useState('')

	return (
		<BearProvider>
			<main className='flex flex-col'>
				<Container size='lg'>
					<Header />
					<Sidebar active={active} setActive={setActive} />
					<Content loader={loaderData.data} />
					<Footer />
				</Container>
			</main>
		</BearProvider>
	)
}

export async function loader() {
	const data = true
	return { data }
}
