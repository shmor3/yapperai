import type { Route } from '@rr/routes/+types/source'
import { invoke } from '@tauri-apps/api/core'
import { useEffect } from 'react'
import { Form, type MetaFunction, useFetcher } from 'react-router'
import { generatePageTitle } from 'utils/page-title'

export const meta: MetaFunction = () => {
	return [{ title: generatePageTitle('Source') }]
}

export async function loader({ params }: Route.LoaderArgs) {
	await new Promise((resolve) => setTimeout(resolve, 500))
	console.log(params.id)
	return { data: 'ok' }
}

export async function ClientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData()
	const name = formData.get('name')
	try {
		const message = await invoke('greet', { name })
		return { greetMsg: message }
	} catch (error) {
		console.error('Error invoking greet:', error)
		return { greetMsg: 'An error occurred while greeting.' }
	}
}

export default ({ loaderData }: Route.ComponentProps) => {
	const { data } = loaderData
	const fetcher = useFetcher()
	useEffect(() => {
		document.title = generatePageTitle('Source')
	}, [])
	return (
		<main>
			<div>Data status: {data}</div>
			<div>
				<Form method='post'>
					<input name='name' placeholder='Enter a name...' />
					<button type='submit'>Greet</button>
				</Form>
				<p>{fetcher.data?.greetMsg}</p>
			</div>
		</main>
	)
}
