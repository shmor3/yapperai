import { useCallback, useEffect, useState } from 'react'

export const closeSplash: React.FC = () => {
	const [hasClosed, setHasClosed] = useState(false)
	const closeSplash = useCallback(async () => {
		if (sessionStorage.getItem('splashClosed') !== 'true') {
			console.log('Closing splash screen')
			await invoke('close_splash')
			sessionStorage.setItem('splashClosed', 'true')
			setHasClosed(true)
		}
	}, [])
	useEffect(() => {
		const splashClosed = sessionStorage.getItem('splashClosed') === 'true'
		if (splashClosed) {
			setHasClosed(true)
		} else {
			const timer = setTimeout(() => {
				closeSplash()
			}, 2000)
			return () => clearTimeout(timer)
		}
	}, [closeSplash])
	return hasClosed
}

export const Splash: React.FC = () => {
	const [isUpdating, setIsUpdating] = useState(false)
	const [updateMessage, setUpdateMessage] = useState('Loading...')
	const update = useCallback(async () => {
		try {
			setIsUpdating(true)
			setUpdateMessage('Checking for updates...')
			const updateResult = await invoke('update')
			if (updateResult === 'update_available') {
				setUpdateMessage('Updating...')
				await invoke('perform_update')
				setUpdateMessage('Update complete!')
			} else {
				setUpdateMessage('No updates available')
			}
		} catch (error) {
			console.error('Update failed:', error)
			setUpdateMessage('Update failed. Please try again later.')
		} finally {
			setIsUpdating(false)
		}
	}, [])
	useEffect(() => {
		update()
	}, [update])
	return (
		<div className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75'>
			<div className='bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center'>
				<h1 className='text-3xl font-bold mb-4 text-gray-800'>
					Welcome to the App!
				</h1>
				<p className='text-lg text-gray-600 mb-6'>{updateMessage}</p>
				{isUpdating && (
					<div className='flex justify-center space-x-2 mb-4'>
						<div className='w-3 h-3 bg-blue-500 rounded-full animate-bounce' />
						<div
							className='w-3 h-3 bg-blue-500 rounded-full animate-bounce'
							style={{ animationDelay: '0.2s' }}
						/>
						<div
							className='w-3 h-3 bg-blue-500 rounded-full animate-bounce'
							style={{ animationDelay: '0.4s' }}
						/>
					</div>
				)}
				<div className='mt-8 h-1 w-full bg-gray-200 rounded-full overflow-hidden'>
					<div
						className='h-full bg-blue-500 rounded-full transition-all duration-500 ease-out'
						style={{ width: isUpdating ? '100%' : '0%' }}
					/>
				</div>
			</div>
		</div>
	)
}
