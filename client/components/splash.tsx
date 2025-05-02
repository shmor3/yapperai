import { Logo } from '@client/components/logo'

export const Splash: React.FC = () => {
	return (
		<div className='flex justify-center items-center w-full h-full bg-base-100'>
			<Logo size={64} />
		</div>
	)
}
