export function Header() {
	return (
		<header className='flex items-center justify-between px-4 py-2 bg-base-100 shadow-lg'>
			<div className='flex-1'>
				<button type='button' className='btn btn-ghost normal-case text-xl'>
					YapperAI
				</button>
			</div>
			<div className='flex-1 flex justify-center'>
				<button type='button' className='btn'>
					1
				</button>
			</div>
			<div className='flex-1 flex justify-end'>
				<button type='button' className='btn'>
					2
				</button>
			</div>
		</header>
	)
}
