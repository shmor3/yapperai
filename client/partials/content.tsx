import { Home } from '@client/pages/home'
import type { useBearStore } from '@client/state/bears'

type BearState = ReturnType<typeof useBearStore.getState>

interface ContentProps extends BearState {}

export function Content({
	bears,
	increasePopulation,
	decreasePopulation,
	removeAllBears,
}: ContentProps) {
	return (
		<div className='flex flex-col items-center justify-center bg-base-200'>
			<Home
				bears={bears}
				increasePopulation={increasePopulation}
				decreasePopulation={decreasePopulation}
				removeAllBears={removeAllBears}
			/>
		</div>
	)
}
