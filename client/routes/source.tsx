import { Content } from '@client/pages/content'
import { generatePageTitle } from '@client/utils/page-title'
import type { Route } from '@rr/routes/+types/source'
import type { MetaFunction } from 'react-router'
import { client } from '../utils/client'

export const meta: MetaFunction = () => {
	return [{ title: generatePageTitle('Source') }]
}

export function HydrateFallback() {
	return <p>Skeleton rendered during SSR</p>
}

export const loader = async () => {
	const data = 'ok'
	return { data }
}

export default ({ loaderData }: Route.ComponentProps) => {
	const trp = async () => await client.start()
	return (
		<main>
			{loaderData.data}
			<div>
				<button
					className='btn'
					type='button'
					onClick={async () => console.log(await trp())}
				>
					Start
				</button>
			</div>
			<Content />
		</main>
	)
}
