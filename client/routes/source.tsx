import { Content } from '@client/pages/content'
import { generatePageTitle } from '@client/utils/page-title'
import type { Route } from '@rr/routes/+types/source'
import type { MetaFunction } from 'react-router'

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
	return (
		<main>
			<div>{loaderData.data}</div>
			<Content />
		</main>
	)
}
