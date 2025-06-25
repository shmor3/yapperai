import { SidebarButton } from '@client/partials/sidebar/button'
import { usePluginItems } from '@client/partials/sidebar/items'
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
	if (!Items || Items.length < 2) return null

	const homeItem = Items[0]
	const pluginIcon = Items[1]
	const otherItems = Items.slice(2, -1)
	const currentActiveTabId = activeTab ?? Items[0]?.id

	useEffect(() => {
		const updateOverflow = () => {
			const sidebar = sidebarRef.current
			const menuItems = sidebar?.querySelectorAll('li.menu-item')
			if (!sidebar || !menuItems) return
			const sidebarHeight = sidebar.clientHeight
			let totalHeight = 0
			const overflowItems: string[] = []
			menuItems.forEach((item, index) => {
				if (index === menuItems.length - 1) return
				totalHeight += item.clientHeight
				if (totalHeight > sidebarHeight - 16) {
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
		handleTabChange(itemId)
	}
	const pluginItems = Items.filter((item) => item.isPlugin)
	return (
		<div
			ref={sidebarRef}
			className='sidebar fixed bottom-[4rem] left-0 top-7 z-10 flex h-full w-[4rem] flex-col items-center justify-between bg-base-300'
		>
			<nav className='flex flex-col w-full h-full pt-10'>
				<ul className='menu flex h-full w-full flex-grow flex-col items-center'>
					<li
						key={homeItem.id}
						data-item-id={homeItem.id}
						className='menu-item mb-1 w-full'
					>
						<SidebarButton
							id={homeItem.id}
							icon={homeItem.icon}
							activeId={currentActiveTabId}
							setActive={() => handleTabChange(homeItem.id)}
							onClick={() => handleNavigation(homeItem.id)}
							className='h-[4rem] w-full'
						/>
					</li>
					{otherItems.map((item) => {
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
									activeId={currentActiveTabId}
									setActive={() => handleTabChange(item.id)}
									onClick={() => handleNavigation(item.id)}
									className='h-[4rem] w-full'
								/>
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
										const item = Items.find((i) => i.id === id)
										if (!item) return null
										return (
											<li key={id} className='w-full'>
												<SidebarButton
													id={id}
													icon={item.icon}
													activeId={currentActiveTabId}
													setActive={() => {
														handleTabChange(id)
													}}
													onClick={() => {
														handleNavigation(id)
														toggleOverflow()
													}}
													className='h-[4rem] w-full px-4'
													showLabel={true}
												/>
											</li>
										)
									})}
								</ul>
							)}
						</li>
					)}
					{pluginItems.map((item) => (
						<li
							key={item.id}
							data-item-id={item.id}
							className='menu-item mb-1 w-full'
						>
							<SidebarButton
								id={item.id}
								icon={item.icon}
								activeId={currentActiveTabId}
								setActive={() => handleTabChange(item.id)}
								onClick={() => handleNavigation(item.id)}
								className='h-[4rem] w-full'
							/>
						</li>
					))}
					<li className='menu-item mt-auto mb-4 w-full'>
						<SidebarButton
							id={pluginIcon.id}
							icon={pluginIcon.icon}
							activeId={currentActiveTabId}
							setActive={() => handleTabChange(pluginIcon.id)}
							onClick={() => handleNavigation(pluginIcon.id)}
							className='h-[4rem] w-full mb-2'
						/>
					</li>
				</ul>
			</nav>
		</div>
	)
}

export default Sidebar
