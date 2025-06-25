import { SidebarButton } from '@client/partials/sidebar/button'
import { usePluginItems, getItemById } from '@client/partials/sidebar/items'
import { useBearContext } from '@state/bears'
import { useEffect, useState, useRef } from 'react'

export const Sidebar: React.FC = () => {
	const { activeTab, handleTabChange } = useBearContext()
	const Items = usePluginItems()
	const [state, setState] = useState({
		overflowItems: [] as string[],
		showOverflow: false,
	})
	const sidebarRef = useRef<HTMLDivElement>(null)
	const bottomRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const updateOverflow = () => {
			const sidebar = sidebarRef.current
			const menuItems = sidebar?.querySelectorAll('li.menu-item')
			const bottom = bottomRef.current
			if (!sidebar || !menuItems) return
			const sidebarHeight = sidebar.clientHeight
			const bottomHeight = bottom?.clientHeight ?? 0
			let totalHeight = 0
			const overflowItems: string[] = []
			menuItems.forEach((item, index) => {
				if (index === menuItems.length - 1) return
				totalHeight += item.clientHeight
				if (totalHeight > sidebarHeight - bottomHeight - 16) {
					const itemId = item.getAttribute('data-item-id')
					if (itemId && itemId !== 'home' && itemId !== 'settings')
						overflowItems.push(itemId)
				}
			})
			setState((prevState) => ({ ...prevState, overflowItems }))
		}
		updateOverflow()
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
		const item = Items.find((item) => item.id === itemId)
		if (item) {
			handleTabChange(Items.findIndex((i) => i.id === itemId))
		}
	}
	const homeItem = Items[0]
	const pluginIcon = Items[Items.length - 1]
	const otherItems = Items.slice(1, -1)
	return (
		<div
			ref={sidebarRef}
			className='sidebar fixed bottom-[4rem] left-0 top-7 z-10 flex h-full w-[4rem] flex-col items-center justify-between bg-base-300'
		>
			<nav className='flex flex-col w-full h-full pt-4'>
				<ul className='menu flex h-full w-full flex-grow flex-col items-center'>
					<li
						key={homeItem.id}
						data-item-id={homeItem.id}
						className='menu-item mb-1 w-full'
					>
						<SidebarButton
							id={homeItem.id}
							icon={homeItem.icon}
							active={(activeTab === 0).toString()}
							setActive={() => handleTabChange(0)}
							onClick={() => handleNavigation(homeItem.id)}
							className='h-[4rem] w-full'
						>
							{homeItem.id}
						</SidebarButton>
					</li>
					{otherItems.map((item, index) => {
						if (state.overflowItems.includes(item.id)) return null
						return (
							<li
								key={item.id}
								data-item-id={item.id}
								className='menu-item mb-1 w-full'
							>
								<SidebarButton
									id={item.id}
									icon={item.icon}
									active={(activeTab === index + 1).toString()}
									setActive={() => handleTabChange(index + 1)}
									onClick={() => handleNavigation(item.id)}
									className='h-[4rem] w-full'
								>
									{item.id}
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
									{state.overflowItems.map((id) => {
										const item = getItemById(id)
										if (!item) return null
										const index = Items.findIndex((item) => item.id === id)
										return (
											<li key={id} className='w-full'>
												<SidebarButton
													id={id}
													icon={item.icon}
													active={(activeTab === index).toString()}
													setActive={() => handleTabChange(index)}
													onClick={() => {
														handleNavigation(id)
														toggleOverflow()
													}}
													className='h-[4rem] w-full px-4'
													showLabel={true}
												>
													{id}
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
						id={pluginIcon.id}
						icon={pluginIcon.icon}
						active={(activeTab === Items.length - 1).toString()}
						setActive={() => handleTabChange(Items.length - 1)}
						onClick={() => handleNavigation(pluginIcon.id)}
						className='h-[4rem] w-full'
					>
						{pluginIcon.id}
					</SidebarButton>
				</div>
			</nav>
		</div>
	)
}

export default Sidebar
