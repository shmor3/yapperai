import { Home } from '@client/pages/home'
import { Settings } from '@client/pages/settings'
import { Splits } from '@client/pages/splits'
import { GearIcon, HomeIcon, AlertIcon } from '@primer/octicons-react'
import type React from 'react'

interface ItemType {
	id: string
	component: React.ComponentType
	icon: React.ReactNode
}

export const Items: ItemType[] = [
	{
		id: 'home',
		component: Home,
		icon: <HomeIcon className='fill-current' />,
	},
	// Add any other items
	{
		id: 'splits',
		component: Splits,
		icon: <AlertIcon className='fill-current' />
	},
	{
		id: 'settings',
		component: Settings,
		icon: <GearIcon className='fill-current' />,
	},
]

export const getItemById = (id: string): ItemType | undefined => {
	return Items.find((item) => item.id === id)
}

export const getItemIndexById = (id: string): number => {
	return Items.findIndex((item) => item.id === id)
}
