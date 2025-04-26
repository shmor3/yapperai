import { SidebarButton } from '@client/partials/sidebar/button'
import { Items } from '@client/partials/sidebar/items'
import { GearIcon } from '@primer/octicons-react'
import type React from 'react'
import { useEffect, useState } from 'react'

export const Sidebar: React.FC<{
	active: string
	setActive: (value: string) => void
}> = ({ active, setActive }) => {
	const [state, setState] = useState({
		overflowItems: [] as string[],
		showOverflow: false,
	})
	useEffect(() => {
		const updateOverflow = () => {
			const sidebar = document.querySelector('.sidebar')
			const menuItems = sidebar?.querySelectorAll('li.menu-item')
			if (!sidebar || !menuItems) return
			const sidebarHeight = sidebar.clientHeight
			let totalHeight = 0
			const overflowItems: string[] = []
			menuItems.forEach((item, index) => {
				if (index === menuItems.length - 1) return
				totalHeight += item.clientHeight
				if (totalHeight > sidebarHeight - 100) {
					const itemId = item.getAttribute('data-item-id')
					if (itemId) overflowItems.push(itemId)
				}
			})
			setState((prevState) => ({ ...prevState, overflowItems }))
		}
		setTimeout(updateOverflow, 0)
		window.addEventListener('resize', updateOverflow)
		return () => window.removeEventListener('resize', updateOverflow)
	}, [])

	const toggleOverflow = () => {
		setState((prevState) => ({
			...prevState,
			showOverflow: !prevState.showOverflow,
		}))
	}

	const handleNavigation = (itemId: string) => {
		setActive(itemId)
	}
	return (
		<div className='sidebar fixed bottom-[4rem] left-0 top-7 z-10 flex h-full w-[4rem] flex-col items-center justify-between bg-base-300'>
			<nav className='flex flex-col w-full h-full pt-4'>
				<ul className='menu flex h-full w-full flex-grow flex-col items-center'>
					{Object.entries(Items).map(([label, { icon }]) => {
						if (state.overflowItems.includes(label) || label === 'settings')
							return null
						return (
							<li
								key={label}
								data-item-id={label}
								className='menu-item mb-1 w-full'
							>
								<SidebarButton
									id={label}
									icon={icon}
									active={active}
									setActive={setActive}
									onClick={() => handleNavigation(label)}
									className='h-[4rem] w-full'
								>
									{label}
								</SidebarButton>
							</li>
						)
					})}
					{state.overflowItems.length > 0 && (
						<li className='mb-1 w-full'>
							<button
								type='button'
								className='btn btn-ghost flex h-[4rem] w-full items-center justify-center'
								onClick={toggleOverflow}
								aria-label='More menu items'
							>
								<span aria-hidden='true'>...</span>
							</button>
							{state.showOverflow && (
								<ul className='absolute bottom-full left-full ml-2 rounded-lg bg-base-300 shadow-lg z-20'>
									{state.overflowItems.map((label) => {
										const { icon } = Items[label]
										return (
											<li key={label} className='w-full'>
												<SidebarButton
													id={label}
													icon={icon}
													active={active}
													setActive={setActive}
													onClick={() => {
														handleNavigation(label)
														toggleOverflow()
													}}
													className='h-[4rem] w-full px-4'
													showLabel={true}
												>
													{label}
												</SidebarButton>
											</li>
										)
									})}
								</ul>
							)}
						</li>
					)}
				</ul>
				<div className='mt-auto mb-4 w-full'>
					<SidebarButton
						id='settings'
						icon={<GearIcon />}
						active={active}
						setActive={setActive}
						onClick={() => handleNavigation('settings')}
						className='h-[4rem] w-full'
					>
						settings
					</SidebarButton>{' '}
				</div>
			</nav>
		</div>
	)
}
