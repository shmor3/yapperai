import { useState, useEffect } from 'react'
const listPlugins = async (): Promise<string[]> => {
	const plugins = await invoke<string[]>('list_plugins')
	return plugins
}
const unloadPlugin = async (pluginId: string): Promise<boolean> => {
	try {
		const result = await invoke<boolean>('unload_plugin', {
			plugin_id: pluginId,
		})
		return result
	} catch (error) {
		console.error('Error unloading plugin:', error)
		return false
	}
}
const callPlugin = async <T = unknown>(
	pluginId: string,
	method: string,
	args: Record<string, unknown>,
): Promise<T> => {
	const result = await invoke<T>('call_plugin', {
		plugin_name: pluginId,
		method,
		args,
	})
	return result
}
export const Plugins: React.FC = () => {
	const [vowelsInput, setVowelsInput] = useState<string>('')
	const [vowels, setVowelsResult] = useState<string>('')
	const [plugins, setPlugins] = useState<string[]>([])
	const [selectedPlugin, setSelectedPlugin] = useState<string>('')
	const [pluginMethod, setPluginMethod] = useState<string>('')
	const [pluginArgs, setPluginArgs] = useState<string>('')
	const [pluginResult, setPluginResult] = useState<string>('')
	const [vowelsPluginAvailable, setVowelsPluginAvailable] =
		useState<boolean>(false)
	useEffect(() => {
		const checkForVowelsPlugin = async () => {
			try {
				const pluginList = await listPlugins()
				setPlugins(pluginList)
				setVowelsPluginAvailable(pluginList.includes('count_vowels'))
			} catch (error) {
				console.error('Error checking for vowels plugin:', error)
			}
		}
		checkForVowelsPlugin()
	}, [])
	const handleCountVowels = async () => {
		if (!vowelsPluginAvailable || !vowelsInput) return
		try {
			const result = await callPlugin<number>('count_vowels', 'count_vowels', {
				text: vowelsInput,
			})
			setVowelsResult(`${result}`)
		} catch (error) {
			console.error('Error counting vowels:', error)
			setVowelsResult('Error')
		}
	}
	const handleListPlugins = async () => {
		try {
			const pluginList = await listPlugins()
			setPlugins(pluginList)
			setVowelsPluginAvailable(pluginList.includes('count_vowels'))
			setPluginResult(
				`Found ${pluginList.length} plugins: ${pluginList.join(', ')}`,
			)
		} catch (error) {
			setPluginResult(`Error listing plugins: ${error}`)
		}
	}
	const handleUnloadPlugin = async () => {
		try {
			if (!selectedPlugin) {
				setPluginResult('Please select a plugin to unload')
				return
			}
			const result = await unloadPlugin(selectedPlugin)
			setPluginResult(`Unload plugin result: ${result ? 'Success' : 'Failed'}`)
			await handleListPlugins()
		} catch (error) {
			setPluginResult(`Error unloading plugin: ${error}`)
		}
	}
	const handleCallPlugin = async () => {
		try {
			if (!selectedPlugin) {
				setPluginResult('Please select a plugin')
				return
			}
			if (!pluginMethod) {
				setPluginResult('Please enter a method name')
				return
			}
			let parsedArgs = {}
			try {
				parsedArgs = pluginArgs ? JSON.parse(pluginArgs) : {}
			} catch (e) {
				setPluginResult(`Invalid JSON arguments: ${e}`)
				return
			}
			console.log(
				`Calling plugin: ${selectedPlugin}, method: ${pluginMethod}, args:`,
				parsedArgs,
			)
			const result = await callPlugin(selectedPlugin, pluginMethod, parsedArgs)
			console.log(`Plugin call result: ${result}`)
			setPluginResult(`Plugin call result: ${JSON.stringify(result)}`)
		} catch (error) {
			console.error('Error calling plugin:', error)
			setPluginResult(`Error calling plugin: ${error}`)
		}
	}
	return (
		<div className='flex flex-col w-full h-full items-center justify-center space-y-6'>
			<div className='flex flex-col space-y-2 w-full max-w-2xl'>
				<h3 className='text-xl font-bold'>Count Vowels Example</h3>
				<div className='flex flex-row space-x-2'>
					<input
						className='input input-bordered flex-grow'
						value={vowelsInput}
						onChange={(e) => setVowelsInput(e.target.value)}
						placeholder='Enter text to count vowels'
						disabled={!vowelsPluginAvailable}
					/>
					<button
						className='btn btn-primary'
						type='button'
						onClick={handleCountVowels}
						disabled={!vowelsPluginAvailable || !vowelsInput}
					>
						Count Vowels
					</button>
				</div>
				<p className='text-lg'>Vowels count: {vowels || '?'}</p>
				{!vowelsPluginAvailable && (
					<p className='text-sm text-yellow-500'>
						Vowels plugin is not available. Please check plugin status.
					</p>
				)}
			</div>
			<div className='flex flex-col space-y-4 w-full max-w-2xl border p-4 rounded-lg'>
				<h3 className='text-xl font-bold'>Plugin Management</h3>
				<p className='text-lg'>
					{pluginResult || 'Plugin operations will show results here'}
				</p>
				<div className='flex flex-row space-x-2'>
					<button
						className='btn btn-primary'
						type='button'
						onClick={handleListPlugins}
					>
						List Plugins
					</button>
				</div>
				{plugins.length > 0 && (
					<div className='flex flex-col space-y-2'>
						<select
							className='select select-bordered w-full'
							value={selectedPlugin}
							onChange={(e) => setSelectedPlugin(e.target.value)}
						>
							<option value=''>Select a plugin</option>
							{plugins.map((plugin) => (
								<option key={plugin} value={plugin}>
									{plugin}
								</option>
							))}
						</select>
						<div className='flex flex-row space-x-2'>
							<button
								className='btn btn-warning'
								type='button'
								onClick={handleUnloadPlugin}
								disabled={!selectedPlugin}
							>
								Unload Plugin
							</button>
						</div>
						<div className='flex flex-col space-y-2'>
							<input
								className='input input-bordered w-full'
								value={pluginMethod}
								onChange={(e) => setPluginMethod(e.target.value)}
								placeholder='Method name'
							/>
							<textarea
								className='textarea textarea-bordered w-full'
								value={pluginArgs}
								onChange={(e) => setPluginArgs(e.target.value)}
								placeholder='Arguments (JSON format)'
								rows={3}
							/>
							<button
								className='btn btn-success'
								type='button'
								onClick={handleCallPlugin}
								disabled={!selectedPlugin || !pluginMethod}
							>
								Call Plugin
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
