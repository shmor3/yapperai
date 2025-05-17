import { Logo } from '@client/components/logo'
import { useState, useCallback, useEffect } from 'react'

const update = async (): Promise<Array<[string, number]>> => {
	const status = await invoke<Array<[string, number]>>('status', {})
	return status
}

export const Splash: React.FC = () => {
	const [status, setStatus] = useState<[string, number]>(['', 0])
	const checkUpdate = useCallback(async () => {
		try {
			const updateStatuses = await update()
			for (const updateStatus of updateStatuses) {
				setStatus(updateStatus)
				await new Promise((resolve) => setTimeout(resolve, 100))
			}
		} catch (error) {
			setStatus(['An error occurred while processing.', 0])
		}
	}, [])
	useEffect(() => {
		checkUpdate().then(async () => {
			await invoke('init')
			await invoke('close')
		})
	}, [checkUpdate])
	return (
		<div className='flex flex-col justify-center items-center p-7 w-full h-full bg-base-100'>
			<div className='flex justify-center items-center mb-10'>
				<Logo size={96} />
			</div>
			<div className='p-5'>
				<p>Status: {status[0]}</p>
				<p>Progress: {status[1]}%</p>
			</div>
		</div>
	)
}
