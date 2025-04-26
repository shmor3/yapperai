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
		<footer className='fixed bottom-0 left-0 right-0 flex h-[2rem] min-w-96 flex-row justify-between bg-base-300 p-2 pl-16 pr-16 text-neutral-400'>
			<div>Development</div>
			<div>yapperAi</div>
			<div>v0.1.0</div>
		</footer>
	)
}
