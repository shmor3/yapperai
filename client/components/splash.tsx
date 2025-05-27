import { Logo } from '@client/components/logo'
import { useState, useCallback, useEffect } from 'react'

const update = async (): Promise<Array<[string, number, string]>> => {
	const status = await invoke<Array<[string, number, string]>>('status', {})
	return status
}

const initPlugins = async (
	plugin_Id: string,
	plugin_Url?: string,
): Promise<boolean> => {
	try {
		await invoke<void>('plugin_init', {
			plugin_id: plugin_Id,
			plugin_url: plugin_Url,
		})
		return true
	} catch (error) {
		console.error('Failed to initialize plugins:', error)
		return false
	}
}

export const Splash: React.FC = () => {
	const [status, setStatus] = useState<[string, number, string]>(['', 0, ''])
	const [pluginsInitialized, setPluginsInitialized] = useState<boolean>(false)
	const checkUpdate = useCallback(async () => {
		try {
			const updateStatuses = await update()
			for (const updateStatus of updateStatuses) {
				setStatus(updateStatus)
				await new Promise((resolve) => setTimeout(resolve, 100))
			}
		} catch (error) {
			setStatus(['An error occurred while processing.', 0, ''])
		}
	}, [])
	const initializePlugins = useCallback(async () => {
		setStatus(['Initializing plugins...', 50, ''])
		try {
			const result = await initPlugins('count_vowels', 'count_vowels')
			if (result) {
				setStatus(['Plugins initialized successfully', 100, ''])
				setPluginsInitialized(true)
				return true
			}
			setStatus(['Failed to initialize plugins', 0, ''])
			setPluginsInitialized(false)
			return false
		} catch (error) {
			console.error('Error initializing plugins:', error)
			setStatus([`Error initializing plugins: ${error}`, 0, ''])
			setPluginsInitialized(false)
			return false
		}
	}, [])
	const closeSplash = useCallback(async () => {
		try {
			await invoke('close_slash', {})
		} catch (error) {
			console.error('Error closing application:', error)
		}
	}, [])
	useEffect(() => {
		const startup = async () => {
			await checkUpdate()
			const success = await initializePlugins()
			if (!success) {
				await new Promise((resolve) => setTimeout(resolve, 5000))
				// await invoke('close_app', {})
			} else {
				if (pluginsInitialized) {
					await closeSplash()
				}
			}
		}
		startup()
	}, [checkUpdate, initializePlugins, pluginsInitialized, closeSplash])
	return (
		<div className='card-sm flex flex-col justify-center items-center p-7 w-full h-full bg-base-100 shadow-sm'>
			<figure className='px-10 pt-10'>
				<Logo size={96} />
			</figure>
			<div className='card-body items-center text-center'>
				<div className='card-actions'>
					(status[1] {'>'} 0 ? ({' '}
					<progress className='progress w-56' value={status[1]} max='100' />) :
					( <p className='text-xs'>{status[2]}</p>))
				</div>
			</div>
		</div>
	)
}
