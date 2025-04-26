import { Home } from '@client/pages/home'
import type { useBearStore } from '@client/state/bears'
import { generatePageTitle } from '@utils/page-title'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => {
	return [{ title: generatePageTitle('Source') }]
}

type BearState = ReturnType<typeof useBearStore.getState>
interface ContentProps extends BearState {}

export function Content({
	bears,
	increasePopulation,
	decreasePopulation,
	removeAllBears,
}: ContentProps) {
	return (
		<div className='flex flex-col w-full h-full items-center justify-center p-5 overflow-hidden bg-base-100'>
			<div className='flex-1 overflow-hidden p-5'>
				<Home
					bears={bears}
					increasePopulation={increasePopulation}
					decreasePopulation={decreasePopulation}
					removeAllBears={removeAllBears}
				/>
			</div>
		</div>
	)
}
