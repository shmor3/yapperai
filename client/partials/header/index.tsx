import { Logo } from '@client/components/logo'
import { Menu } from '@client/partials/header/menu'
import { Notify } from '@client/partials/header/notify'
import { Switch } from '@client/partials/header/switch'

export const Header: React.FC = () => {
	return (
		<header className='fixed left-0 right-0 top-7 h-12 w-full min-w-96 bg-base-100 shadow-sm'>
			<nav className='grid h-full w-full grid-cols-3 items-center px-4 pl-16'>
				<div className='justify-self-start'>
					<Switch />
				</div>
				<div className='justify-self-center'>
					<Logo size={32} />
				</div>
				<div className='flex justify-self-end gap-4'>
					<Notify />
					<Menu />
				</div>
			</nav>
		</header>
	)
}
