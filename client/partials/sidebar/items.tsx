import { Home } from '@client/pages/home'
import { Plugins } from '@client/pages/plugins'
import {
	HomeIcon,
	TypographyIcon,
	CommentIcon,
	NumberIcon,
	PackageIcon,
} from '@primer/octicons-react'
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
	{
		id: 'chat',
		component: Plugins,
		icon: <CommentIcon className='fill-current' />,
	},
	{
		id: 'math-sum',
		component: Plugins,
		icon: <NumberIcon className='fill-current' />,
	},
	{
		id: 'count-vowels',
		component: Plugins,
		icon: <TypographyIcon className='fill-current' />,
	},
	{
		id: 'plugins',
		component: Plugins,
		icon: <PackageIcon className='fill-current' />,
	},
]

export const getItemById = (id: string): ItemType | undefined => {
	return Items.find((item) => item.id === id)
}

export const getItemIndexById = (id: string): number => {
	return Items.findIndex((item) => item.id === id)
}
