import { Container } from '@client/components/container'
import { Content } from '@client/partials/content'
import { Footer } from '@client/partials/footer'
import { Header } from '@client/partials/header'
import { Sidebar } from '@client/partials/sidebar'
import { BearState } from '@client/state/bears'
import type { Route } from '@rr/routes/+types/source'
import React from 'react'

export default function Component({ loaderData }: Route.ComponentProps) {
	const [active, setActive] = React.useState('')
	return (
		<BearState>
			{({ bears, increasePopulation, decreasePopulation, removeAllBears }) => (
				<main className='flex flex-col'>
					<Container size='lg'>
						<Header />
						<Sidebar active={active} setActive={setActive} />
						<Content
							bears={bears}
							increasePopulation={increasePopulation}
							decreasePopulation={decreasePopulation}
							removeAllBears={removeAllBears}
						/>
						{loaderData.data}
						<Footer />
					</Container>
				</main>
			)}
		</BearState>
	)
}

export async function loader() {
	const data = 'loader'
	return { data }
}
