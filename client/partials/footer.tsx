export function Footer() {
	return (
		<footer className='flex flex-row justify-between items-center bg-base-200 text-base-content'>
			<div className='flex-1 text-xs'>
				<div className='stat bg-base-100 shadow-sm rounded-lg'>
					<div className='stat-value text-primary text-xl'>25.6K</div>
				</div>
			</div>
			<div className='flex-1 flex justify-center text-xs'>
				<div className='stat bg-base-100 shadow-sm rounded-lg'>
					<div className='stat-value text-secondary text-xl'>2.6M</div>
				</div>
			</div>
			<div className='flex-1 flex justify-end text-xs'>
				<div className='stat bg-base-100 shadow-sm rounded-lg'>
					<div className='stat-value text-xl'>86%</div>
				</div>
			</div>
		</footer>
	)
}
