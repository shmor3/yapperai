import { Logo } from '@client/components/logo'
import { useState, useCallback, useEffect } from 'react'

const update = async (): Promise<Array<[string, number]>> => {
	const status = await invoke<Array<[string, number]>>('status', {})
	return status
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
	const [status, setStatus] = useState<[string, number]>(['', 0])
	const [pluginsInitialized, setPluginsInitialized] = useState<boolean>(false)
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
	const initializePlugins = useCallback(async () => {
		setStatus(['Initializing plugins...', 50])
		try {
			const result = await initPlugins('count_vowels', 'count_vowels')
			if (result) {
				setStatus(['Plugins initialized successfully', 100])
				setPluginsInitialized(true)
				return true
			}
			setStatus(['Failed to initialize plugins', 0])
			setPluginsInitialized(false)
			return false
		} catch (error) {
			console.error('Error initializing plugins:', error)
			setStatus(['Error initializing plugins', 0])
			setPluginsInitialized(false)
			return false
		}
	}, [])
	const closeApplication = useCallback(async () => {
		try {
			await invoke('close')
		} catch (error) {
			console.error('Error closing application:', error)
		}
	}, [])
	useEffect(() => {
		const startup = async () => {
			await checkUpdate()
			const success = await initializePlugins()
			if (!success) {
				await new Promise((resolve) => setTimeout(resolve, 2000))
			}
			await closeApplication()
		}
		startup()
	}, [checkUpdate, initializePlugins, closeApplication])
	return (
		<div className='flex flex-col justify-center items-center p-7 w-full h-full bg-base-100'>
			<div className='flex justify-center items-center mb-10'>
				<Logo size={96} />
			</div>
			<div className='p-5'>
				<p>Status: {status[0]}</p>
				<p>Progress: {status[1]}%</p>
				{pluginsInitialized && (
					<p className='text-success'>Plugins initialized successfully</p>
				)}
			</div>
		</div>
	)
}
