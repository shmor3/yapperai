import { Home } from '@client/pages/home'
// import { useBearContext } from '@client/state/bears'
import { generatePageTitle } from '@utils/page-title'
import { type MetaFunction, useLoaderData } from 'react-router'

export const meta: MetaFunction = () => {
	return [{ title: generatePageTitle('Source') }]
}

export function Content({ loader }: { loader: boolean }) {
	if (!loader) {
		console.error('Loader data is not ready:', loader)
	}
	// const { bears, increasePopulation, decreasePopulation, removeAllBears } =
	// 	useBearContext()
	const loaderData = useLoaderData<{ data: boolean }>()
	return (
		<div className='flex w-full h-full pl-16 bg-base-100'>
			<div className='flex flex-col items-center justify-start w-full overflow-hidden pt-20 pb-4 bg-base-100'>
				<div className='w-full max-w-4xl px-4 bg-base-100 overflow-hidden'>
					<Home loader={loaderData?.data} />
				</div>
			</div>
		</div>
	)
}

export async function loader() {
	const data = true
	return { data }
}
