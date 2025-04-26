import type { ReactNode } from 'react'

interface SidebarButtonProps {
	children?: ReactNode
	id: string
	icon: ReactNode
	active: string
	setActive: (value: string) => void
	className?: string
	showLabel?: boolean
	onClick?: () => void
}

export function SidebarButton({
	children,
	id,
	icon,
	active,
	setActive,
	className = '',
	showLabel = false,
	onClick,
}: SidebarButtonProps) {
	const isActive = active === id
	const handleClick = () => {
		setActive(id)
		if (onClick) onClick()
	}
	return (
		<button
			type='button'
			onClick={handleClick}
			className={`btn btn-ghost flex items-center ${
				showLabel ? 'justify-start' : 'justify-center'
			} ${
				isActive
					? 'bg-base-100 shadow-md'
					: 'text-base-content hover:bg-base-200'
			} ${className}`}
		>
			<span className={showLabel ? 'mr-2' : ''}>{icon}</span>
			{showLabel && children && <span>{children}</span>}
		</button>
	)
}
