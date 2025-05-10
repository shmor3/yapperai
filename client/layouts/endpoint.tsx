import { Outlet } from 'react-router'
import { api } from '../api'

const message = {
	version: Number(1),
	endpoint: 'health',
	payload: '',
}

export default function Layout() {
	return <Outlet />
}

export async function loader() {
	const health = await api.request.retrieve(message)
	console.log(health)
	if (!health) {
		return { error: 'heathcheck failed' }
	}
	return { health }
}
