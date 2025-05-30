import { Logo } from '@client/components/logo'
import { useState, useCallback, useEffect } from 'react'

type StatusUpdate = [string, number, string]

const fetchStatus = async (): Promise<StatusUpdate[]> => {
	try {
		const status = await invoke<StatusUpdate[]>('status')
		return status
	} catch (error) {
		console.error('Error fetching status:', error)
		return [['Error fetching status', 0, String(error)]]
	}
}

const initPlugins = async (
	pluginId: string,
	pluginUrl?: string,
): Promise<boolean> => {
	try {
		await invoke<void>('plugin_init', {
			plugin_id: pluginId,
			plugin_url: pluginUrl,
		})
		return true
	} catch (error) {
		console.error('Failed to initialize plugins:', error)
		return false
	}
}

export const Splash: React.FC = () => {
	const [status, setStatus] = useState<StatusUpdate>([
		'Starting application...',
		0,
		'Please wait...',
	])
	const [isComplete, setIsComplete] = useState<boolean>(false)
	const processStatusUpdates = useCallback(async () => {
		try {
			const statusUpdates = await fetchStatus()
			for (const update of statusUpdates) {
				setStatus(update)
				await new Promise((resolve) => setTimeout(resolve, 150))
			}
			if (statusUpdates.length > 0) {
				const firstUpdate = statusUpdates[0]
				if (firstUpdate[0] === 'Initializing plugins') {
					return await handlePluginInitialization()
				}
				const finalUpdate = statusUpdates[statusUpdates.length - 1]
				if (finalUpdate[1] === 100) {
					setIsComplete(true)
				}
			}
			return true
		} catch (error) {
			setStatus(['Error during startup', 0, `An error occurred: ${error}`])
			return false
		}
	}, [])
	const handlePluginInitialization = useCallback(async () => {
		try {
			const result = await initPlugins('count_vowels', 'count_vowels')
			if (result) {
				setStatus(['Initialization complete', 100, 'Ready to launch!'])
				setIsComplete(true)
				return true
			}
			setStatus([
				'Plugin initialization failed',
				0,
				'Could not initialize required plugins',
			])
			return false
		} catch (error) {
			setStatus(['Plugin error', 0, `Error: ${error}`])
			return false
		}
	}, [])
	const closeSplash = useCallback(async () => {
		try {
			await invoke('close_splash')
		} catch (error) {
			console.error('Error closing splash screen:', error)
			try {
				await invoke('close_app')
			} catch (secondError) {
				console.error('Failed to close application:', secondError)
			}
		}
	}, [])
	useEffect(() => {
		const startup = async () => {
			const success = await processStatusUpdates()
			if (success && isComplete) {
				await new Promise((resolve) => setTimeout(resolve, 1000))
				await closeSplash()
			} else if (!success) {
				await new Promise((resolve) => setTimeout(resolve, 5000))
				await closeSplash()
			}
		}
		startup()
	}, [processStatusUpdates, isComplete, closeSplash])
	const getProgressColor = (progress: number): string => {
		if (progress < 30) return 'progress-error'
		if (progress < 70) return 'progress-warning'
		return 'progress-success'
	}
	return (
		<div className='card-sm flex flex-col justify-center items-center p-7 w-full h-full bg-base-100'>
			<figure className='px-10 pt-10 pb-6'>
				<Logo size={96} />
			</figure>
			<div className='card-body items-center text-center'>
				<h3 className='card-title text-lg mb-2'>{status[0]}</h3>
				<div className='card-actions flex flex-col items-center w-full'>
					{status[1] > 0 ? (
						<>
							<progress
								className={`progress w-56 ${getProgressColor(status[1])}`}
								value={status[1]}
								max='100'
							/>
							<div className='flex justify-between w-56 mt-1'>
								<p className='text-xs'>{status[2]}</p>
								<p className='text-xs font-bold'>{status[1]}%</p>
							</div>
						</>
					) : (
						<p className='text-xs mt-2'>{status[2] || 'Starting...'}</p>
					)}
				</div>
			</div>
		</div>
	)
}
