import { useState } from 'react'

interface PluginMetadata {
	name: string
	version: string
	description: string
	author: string
	logo?: string
	license?: string
	homepage?: string
	repository?: string
	keywords: string[]
	api_version: string
}

interface PluginManifest {
	metadata: PluginMetadata
	capabilities: string[]
	ui_available: boolean
	event_handlers: string[]
}

interface LoadedPlugin {
	id: string
	metadata?: PluginMetadata
	manifest?: PluginManifest
	hasUI: boolean
}

const listPlugins = async (): Promise<string[]> => {
	const plugins = await invoke<string[]>('list_plugins')
	return plugins
}

const unloadPlugin = async (pluginId: string): Promise<boolean> => {
	try {
		await invoke<void>('unload_plugin', {
			pluginId: pluginId,
		})
		return true
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
		pluginId: pluginId,
		method,
		args,
	})
	return result
}

const getPluginMetadata = async (
	pluginId: string,
): Promise<PluginMetadata | null> => {
	try {
		const result = await callPlugin<PluginMetadata>(
			pluginId,
			'get_metadata',
			{},
		)
		return result
	} catch (error) {
		console.error(`Error getting metadata for plugin ${pluginId}:`, error)
		return null
	}
}

const getPluginManifest = async (
	pluginId: string,
): Promise<PluginManifest | null> => {
	try {
		const result = await callPlugin<PluginManifest>(
			pluginId,
			'get_manifest',
			{},
		)
		return result
	} catch (error) {
		console.error(`Error getting manifest for plugin ${pluginId}:`, error)
		return null
	}
}

interface PluginsProps {
	onPluginsChange?: (plugins: LoadedPlugin[]) => void
}

export const Plugins: React.FC<PluginsProps> = ({ onPluginsChange }) => {
	const [plugins, setPlugins] = useState<string[]>([])
	const [loadedPlugins, setLoadedPlugins] = useState<LoadedPlugin[]>([])
	const [selectedPlugin, setSelectedPlugin] = useState<string>('')
	const [pluginMethod, setPluginMethod] = useState<string>('')
	const [pluginArgs, setPluginArgs] = useState<string>('')
	const [pluginResult, setPluginResult] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)

	const loadPluginDetails = async (
		pluginIds: string[],
	): Promise<LoadedPlugin[]> => {
		const pluginDetails: LoadedPlugin[] = []

		for (const id of pluginIds) {
			const metadata = await getPluginMetadata(id)
			const manifest = await getPluginManifest(id)

			pluginDetails.push({
				id,
				metadata: metadata || undefined,
				manifest: manifest || undefined,
				hasUI: manifest?.ui_available || false,
			})
		}

		return pluginDetails
	}

	const handleListPlugins = async () => {
		setLoading(true)
		try {
			const pluginList = await listPlugins()
			setPlugins(pluginList)

			// Load detailed plugin information
			const detailedPlugins = await loadPluginDetails(pluginList)
			setLoadedPlugins(detailedPlugins)

			// Notify parent component about plugin changes
			onPluginsChange?.(detailedPlugins)

			setPluginResult(
				`Found ${pluginList.length} plugins: ${pluginList.join(', ')}`,
			)
		} catch (error) {
			setPluginResult(`Error listing plugins: ${error}`)
		} finally {
			setLoading(false)
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

			if (result) {
				// Refresh plugin list after successful unload
				await handleListPlugins()
				setSelectedPlugin('')
			}
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
			console.log('Plugin call result:', result)
			setPluginResult(`Plugin call result: ${JSON.stringify(result, null, 2)}`)
		} catch (error) {
			console.error('Error calling plugin:', error)
			setPluginResult(`Error calling plugin: ${error}`)
		}
	}

	const selectedPluginDetails = loadedPlugins.find(
		(p) => p.id === selectedPlugin,
	)

	return (
		<div className='flex flex-col w-full h-full items-center justify-center space-y-6 p-6'>
			<div className='flex flex-col space-y-4 w-full max-w-4xl'>
				<div className='border p-4 rounded-lg'>
					<h3 className='text-xl font-bold mb-4'>Plugin Management</h3>

					<div className='bg-gray-100 p-3 rounded mb-4 min-h-[100px]'>
						<p className='text-sm font-medium mb-2'>Status:</p>
						<p className='text-sm whitespace-pre-wrap'>
							{pluginResult || 'Plugin operations will show results here'}
						</p>
					</div>

					<div className='flex flex-row space-x-2 mb-4'>
						<button
							className='btn btn-primary'
							type='button'
							onClick={handleListPlugins}
							disabled={loading}
						>
							{loading ? 'Loading...' : 'Refresh Plugins'}
						</button>
					</div>

					{plugins.length > 0 && (
						<div className='flex flex-col space-y-4'>
							<div>
								<p className='block text-sm font-medium mb-2'>Select Plugin:</p>
								<select
									className='select select-bordered w-full'
									value={selectedPlugin}
									onChange={(e) => setSelectedPlugin(e.target.value)}
								>
									<option value=''>Select a plugin</option>
									{loadedPlugins.map((plugin) => (
										<option key={plugin.id} value={plugin.id}>
											{plugin.metadata?.name || plugin.id}
											{plugin.metadata?.version
												? ` v${plugin.metadata.version}`
												: ''}
											{plugin.hasUI ? ' (UI Available)' : ''}
										</option>
									))}
								</select>
							</div>

							{selectedPluginDetails && (
								<div className='bg-blue-50 p-4 rounded-lg'>
									<h4 className='font-semibold mb-2'>Plugin Details:</h4>
									<div className='grid grid-cols-2 gap-2 text-sm'>
										<div>
											<strong>Name:</strong>{' '}
											{selectedPluginDetails.metadata?.name ||
												selectedPluginDetails.id}
										</div>
										<div>
											<strong>Version:</strong>{' '}
											{selectedPluginDetails.metadata?.version || 'Unknown'}
										</div>
										<div>
											<strong>Author:</strong>{' '}
											{selectedPluginDetails.metadata?.author || 'Unknown'}
										</div>
										<div>
											<strong>UI Available:</strong>{' '}
											{selectedPluginDetails.hasUI ? 'Yes' : 'No'}
										</div>
									</div>
									{selectedPluginDetails.metadata?.description && (
										<div className='mt-2'>
											<strong>Description:</strong>{' '}
											{selectedPluginDetails.metadata.description}
										</div>
									)}
									{selectedPluginDetails.manifest?.capabilities && (
										<div className='mt-2'>
											<strong>Capabilities:</strong>{' '}
											{selectedPluginDetails.manifest.capabilities.join(', ')}
										</div>
									)}
								</div>
							)}

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

							<div className='border-t pt-4'>
								<h4 className='font-semibold mb-3'>Call Plugin Method:</h4>
								<div className='flex flex-col space-y-2'>
									<input
										className='input input-bordered w-full'
										value={pluginMethod}
										onChange={(e) => setPluginMethod(e.target.value)}
										placeholder='Method name (e.g., get_ui, handle_event)'
									/>
									<textarea
										className='textarea textarea-bordered w-full'
										value={pluginArgs}
										onChange={(e) => setPluginArgs(e.target.value)}
										placeholder='Arguments (JSON format, e.g., {"key": "value"})'
										rows={3}
									/>
									<button
										className='btn btn-success'
										type='button'
										onClick={handleCallPlugin}
										disabled={!selectedPlugin || !pluginMethod}
									>
										Call Plugin Method
									</button>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Plugin List Summary */}
				{loadedPlugins.length > 0 && (
					<div className='border p-4 rounded-lg'>
						<h4 className='font-semibold mb-3'>Loaded Plugins Summary:</h4>
						<div className='grid gap-2'>
							{loadedPlugins.map((plugin) => (
								<div
									key={plugin.id}
									className='flex items-center justify-between p-2 bg-gray-50 rounded'
								>
									<div className='flex items-center space-x-3'>
										{plugin.metadata?.logo && (
											<img
												src={plugin.metadata.logo}
												alt={plugin.metadata.name}
												className='w-6 h-6'
											/>
										)}
										<div>
											<div className='font-medium'>
												{plugin.metadata?.name || plugin.id}
											</div>
											<div className='text-sm text-gray-600'>
												{plugin.metadata?.version &&
													`v${plugin.metadata.version}`}
												{plugin.hasUI && (
													<span className='ml-2 text-blue-600'>(UI)</span>
												)}
											</div>
										</div>
									</div>
									<div className='flex items-center space-x-2'>
										{plugin.hasUI && (
											<span className='badge badge-info badge-sm'>UI</span>
										)}
										<span className='badge badge-success badge-sm'>Loaded</span>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
