import { useEffect, useCallback, useState } from 'react'

type StatusUpdate = {
	step: string
	progress: number
	message: string
}

const fetchStatus = async (): Promise<StatusUpdate> => {
	try {
		const response = await invoke<StatusUpdate>('status')
		console.log('Status response:', response)
		return response
	} catch (error) {
		console.error('Error fetching status:', error)
		return {
			step: 'Error',
			progress: 0,
			message: error instanceof Error ? error.message : String(error),
		}
	}
}

export const Splash: React.FC = () => {
	const [status, setStatus] = useState<StatusUpdate>({
		step: 'Initializing...',
		progress: 0,
		message: 'Please wait...',
	})
	const [isStuck, setIsStuck] = useState(false)
	const [_, setLoading] = useState(true)
	useEffect(() => {
		let lastProgress = 0
		let lastUpdateTime = Date.now()
		const MAX_STUCK_TIME = 15000
		const getStatus = async (retries = 3) => {
			for (let i = 0; i < retries; i++) {
				try {
					setLoading(true)
					const update = await fetchStatus()
					const currentTime = Date.now()
					if (
						update.progress === lastProgress &&
						update.progress < 100 &&
						currentTime - lastUpdateTime > MAX_STUCK_TIME
					) {
						setIsStuck(true)
					} else if (update.progress !== lastProgress) {
						lastUpdateTime = currentTime
						setIsStuck(false)
					}
					lastProgress = update.progress
					setStatus(update)
					return
				} catch (error) {
					if (i === retries - 1) {
						console.error('Max retries reached:', error)
						setStatus({
							step: 'Error',
							progress: 0,
							message: String(error),
						})
					}
					await new Promise((resolve) => setTimeout(resolve, 1000))
				} finally {
					setLoading(false)
					const closeSplash = useCallback(async () => {
						try {
							await invoke('close_slash', {})
						} catch (error) {
							console.error('Error closing application:', error)
						}
					}, [])
					closeSplash()
				}
			}
		}
		getStatus()
		const interval = setInterval(getStatus, 1000)
		return () => clearInterval(interval)
	}, [])
	return (
		<div className='card-sm flex flex-col justify-center items-center p-7 w-full h-full bg-base-100'>
			<div className='flex flex-col items-center'>
				<h3>{status.step}</h3>
				<div className='flex items-center gap-2'>
					<progress
						className={`progress w-56 ${isStuck ? 'progress-warning' : ''}`}
						value={status.progress}
						max='100'
					/>
					<span>{status.progress}%</span>
				</div>
				<p className='text-sm'>
					{isStuck
						? 'Loading seems to be taking longer than expected...'
						: status.message}
				</p>
			</div>
		</div>
	)
}
