import type React from 'react'
import { useEffect } from 'react'

export const Footer: React.FC = () => {
	useEffect(() => {
		const handleLoad = async () => {
			console.log('Loading')
		}
		window.addEventListener('load', handleLoad)
		return () => {
			window.removeEventListener('load', handleLoad)
		}
	}, [])
	return (
		<footer className='fixed bottom-0 left-0 right-0 grid h-[2rem] min-w-96 grid-cols-3 bg-base-300 px-4 pl-16 text-neutral-400 items-center'>
			<div className='justify-self-start'>Dev</div>
			<div className='justify-self-center'>yapperAi</div>
			<div className='justify-self-end'>v0.1.0</div>
		</footer>
	)
}
