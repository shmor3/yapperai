import { Container } from '@client/components/container'
import { Outlet } from 'react-router'

export default function Default() {
	return (
		<main>
			<Container>
				<Outlet />
			</Container>
		</main>
	)
}
