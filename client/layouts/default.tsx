import { Container } from '@client/components/container'
import { BearProvider } from '@state/bears'
import { Outlet } from 'react-router'

export default function Default() {
	return (
		<main>
			<Container>
				<BearProvider>
					<Outlet />
				</BearProvider>
			</Container>
		</main>
	)
}
