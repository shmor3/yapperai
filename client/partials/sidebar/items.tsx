import { Home } from '@client/pages/home'
import { Plugins } from '@client/pages/plugins'
import { HomeIcon, PackageIcon, PlugIcon } from '@primer/octicons-react'
import React from 'react'
import { useCallback, useEffect, useState } from 'react'

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
interface LoadedPlugin {
	id: string
	metadata?: PluginMetadata
	has_ui: boolean
}
export interface ItemType {
	id: string
	component: React.ComponentType
	icon: React.ReactNode
	title?: string
	isPlugin?: boolean
	pluginId?: string
}

const staticItems: ItemType[] = [
	{
		id: 'home',
		component: Home,
		icon: <HomeIcon className='fill-current' />,
		title: 'Home',
	},
	{
		id: 'plugins',
		component: Plugins,
		icon: <PackageIcon className='fill-current' />,
		title: 'Plugins',
	},
]

const PluginUIRenderer: React.FC<{ pluginId: string }> = ({ pluginId }) => {
	const [ui, setUI] = useState<React.ReactElement | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	useEffect(() => {
		let cancelled = false
		const loadPluginUI = async () => {
			try {
				setLoading(true)
				setError(null)
				const result = await invoke<unknown>('call_plugin', {
					pluginId,
					method: 'get_ui',
					args: {},
				})
				if (!cancelled) {
					if (React.isValidElement(result)) {
						setUI(result)
					} else if (typeof result === 'string') {
						setUI(<div dangerouslySetInnerHTML={{ __html: result }} />)
					} else {
						setUI(null)
					}
				}
			} catch (err) {
				if (!cancelled) setError(`Failed to load plugin UI: ${err}`)
			} finally {
				if (!cancelled) setLoading(false)
			}
		}
		loadPluginUI()
		return () => {
			cancelled = true
		}
	}, [pluginId])
	if (loading) return <div>Loading plugin UI...</div>
	if (error) return <div className='text-red-500'>{error}</div>
	if (!ui) return <div>No UI available for this plugin</div>
	return <div>{ui}</div>
}

export function usePluginItems(): ItemType[] {
	const [items, setItems] = useState<ItemType[]>(staticItems)
	const refreshFromBackend = useCallback(async () => {
		try {
			const ids: string[] = await invoke('list_plugins')
			const plugins: LoadedPlugin[] = await Promise.all(
				ids.map(async (id) => {
					try {
						const plugin = await invoke<LoadedPlugin>('get_plugin_info', {
							pluginId: id,
						})
						return plugin
					} catch (e) {
						console.warn(`Failed to load plugin info for ${id}`, e)
						return null
					}
				}),
			).then((arr) => arr.filter((p): p is LoadedPlugin => p !== null))
			const pluginItems: ItemType[] = plugins
				.filter((plugin) => plugin.has_ui)
				.map((plugin) => ({
					id: `plugin-${plugin.id}`,
					component: () => <PluginUIRenderer pluginId={plugin.id} />,
					icon: plugin.metadata?.logo ? (
						<img
							src={plugin.metadata.logo}
							alt={plugin.metadata.name}
							className='w-4 h-4'
						/>
					) : (
						<PlugIcon className='fill-current' />
					),
					title: plugin.metadata?.name || plugin.id,
					isPlugin: true,
					pluginId: plugin.id,
				}))
			setItems([...staticItems, ...pluginItems])
		} catch (e) {
			console.error('Failed to refresh plugins:', e)
		}
	}, [])
	useEffect(() => {
		refreshFromBackend()
	}, [refreshFromBackend])
	return items
}

export { PluginUIRenderer }
