import { api } from '../api'
import type { Route } from '@rr/routes/+types/endpoint'

export default function Component({ loaderData }: Route.ComponentProps) {
	if (!loaderData) return null
	return loaderData
}

export async function loader({ params }: Route.LoaderArgs) {
	const message = {
		version: Number(params.version),
		endpoint: params.endpoint,
		payload: '',
	}
	const data = await api.request.retrieve(message)
	return { data }
}
