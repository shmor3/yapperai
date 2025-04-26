import { ChevronDownIcon } from '@primer/octicons-react'

export function Switch() {
	return (
		<div className='dropdown dropdown-start'>
			<button type='button' tabIndex={0} className='btn btn-ghost'>
				<span className='text-neutral-400'>8b</span>
				<ChevronDownIcon className='text-neutral-400' />
			</button>
			<ul className='dropdown-content menu rounded-box menu-sm z-10 mt-3 w-52 bg-base-100 p-2 shadow'>
				<li className='mb-1'>
					<div className='font-medium text-base-content pb-1 pt-1'>{'-'}</div>
				</li>
				<li className='mb-1'>
					<div className='font-medium text-base-content pb-1 pt-1'>{'-'}</div>
				</li>
			</ul>
		</div>
	)
}
