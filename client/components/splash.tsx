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

function parseStepInfo(statusMsg: string) {
	const stepMatch = statusMsg.match(
		/^(Step\s*\d+):\s*(.+?)(?:\s*\((\d+)\/(\d+)\))?$/i,
	)
	if (stepMatch) {
		return {
			mainStep: stepMatch[1],
			subStep: stepMatch[2],
			subStepCurrent: stepMatch[3] ? Number.parseInt(stepMatch[3], 10) : null,
			subStepTotal: stepMatch[4] ? Number.parseInt(stepMatch[4], 10) : null,
		}
	}
	return {
		mainStep: statusMsg,
		subStep: '',
		subStepCurrent: null,
		subStepTotal: null,
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
				<p className='text-sm'>
					{isStuck
						? 'Loading seems to be taking longer than expected...'
						: status.message}
				</p>
			</div>
		</div>
	)
}
