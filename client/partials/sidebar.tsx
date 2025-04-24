export function Sidebar() {
	return (
		<div className='flex flex-col h-screen bg-base-200 shadow-lg'>
			<aside className='w-64 flex flex-col p-4 overflow-y-auto'>
				<h2 className='text-2xl font-bold mb-4'>Sidebar</h2>
				<ul className='menu bg-base-100 rounded-box flex-grow'>
					<li className='mb-2'>
						<button
							type='button'
							className='btn btn-ghost justify-start w-full hover:bg-primary hover:text-primary-content'
						>
							Item 1
						</button>
					</li>
					<li className='mb-2'>
						<button
							type='button'
							className='btn btn-ghost justify-start w-full hover:bg-primary hover:text-primary-content'
						>
							Item 2
						</button>
					</li>
					<li className='mb-2'>
						<button
							type='button'
							className='btn btn-ghost justify-start w-full hover:bg-primary hover:text-primary-content'
						>
							Item 3
						</button>
					</li>
				</ul>
			</aside>
		</div>
	)
}
