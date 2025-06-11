import { Logo } from '@client/components/logo'
import { useState, useCallback, useEffect, useRef } from 'react'

type StatusUpdate = [string, number, string]

const fetchStatus = async (): Promise<StatusUpdate[]> => {
	try {
		return await invoke<StatusUpdate[]>('status')
	} catch (error) {
		console.error('Error fetching status:', error)
		return [['Error fetching status', 0, String(error)]]
	}
}

const closeSplash = async () => {
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
}

export const Splash: React.FC = () => {
	const [status, setStatus] = useState<StatusUpdate>([
		'Starting application...',
		0,
		'Please wait...',
	])
	const [isComplete, setIsComplete] = useState(false)
	const [hasError, setHasError] = useState(false)
	const pollingRef = useRef<NodeJS.Timeout | null>(null)

	const pollStatus = useCallback(async () => {
		const updates = await fetchStatus()
		const last = updates[updates.length - 1]
		setStatus(last)
		if (last[1] === 100) {
			setIsComplete(true)
			return
		}
		if (last[0].toLowerCase().includes('error')) {
			setHasError(true)
			return
		}
	}, [])

	useEffect(() => {
		if (isComplete || hasError) {
			const timeout = setTimeout(
				() => {
					if (pollingRef.current) {
						clearInterval(pollingRef.current)
						pollingRef.current = null
					}
					closeSplash()
				},
				isComplete ? 1000 : 4000,
			)
			return () => clearTimeout(timeout)
		}
		pollingRef.current = setInterval(() => {
			pollStatus()
		}, 300)
		pollStatus()
		return () => {
			if (pollingRef.current) {
				clearInterval(pollingRef.current)
				pollingRef.current = null
			}
		}
	}, [isComplete, hasError, pollStatus])

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
					{status[1] > 0 && status[1] < 100 ? (
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
						<p className='text-xs mt-2'>
							{status[2] ||
								(isComplete
									? 'Startup complete!'
									: hasError
										? 'Startup failed'
										: 'Starting...')}
						</p>
					)}
				</div>
			</div>
		</div>
	)
}
