import { Menu } from '@client/partials/header/menu'
import { Notify } from '@client/partials/header/notify'
import { Switch } from '@client/partials/header/switch'

export const Header: React.FC = () => {
	return (
		<header className='fixed left-0 right-0 top-7 flex h-12 w-full items-center flex-row justify-between bg-base-100 shadow-sm pl-16 pr-16'>
			<nav className='navbar w-full px-4'>
				<div className='flex-1'>
					<Switch />
				</div>
				<div className='flex flex-1 justify-end'>
					<Notify />
					<Menu />
				</div>
			</nav>
		</header>
	)
}
