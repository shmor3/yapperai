import { Container } from '@client/components/container'
import { Content } from '@client/partials/content'
import { Footer } from '@client/partials/footer'
import { Header } from '@client/partials/header'
import { Sidebar } from '@client/partials/sidebar'
import { BearState } from '@client/state/bears'

export default function Source() {
	return (
		<BearState>
			{({ bears, increasePopulation, decreasePopulation, removeAllBears }) => (
				<main>
					<Container>
						<Header />
						<Sidebar />
						<Content
							bears={bears}
							increasePopulation={increasePopulation}
							decreasePopulation={decreasePopulation}
							removeAllBears={removeAllBears}
						/>
						<Footer />
					</Container>
				</main>
			)}
		</BearState>
	)
}
