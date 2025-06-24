import { Home } from '@client/pages/home'
import { Plugins } from '@client/pages/plugins'
import { HomeIcon, PackageIcon, PlugIcon } from '@primer/octicons-react'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
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
				if (!cancelled) setUI(result as React.ReactElement | null)
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
	return <div>{JSON.stringify(ui)}</div>
}
type Listener = (items: ItemType[]) => void
function usePluginItemsInternal() {
	const [items, setItems] = useState<ItemType[]>(staticItems)
	const listenersRef = useRef<Listener[]>([])
	const notify = useCallback((newItems: ItemType[]) => {
		for (const listener of listenersRef.current) {
			listener(newItems)
		}
	}, [])
	const subscribe = useCallback((listener: Listener) => {
		listenersRef.current.push(listener)
		return () => {
			listenersRef.current = listenersRef.current.filter((l) => l !== listener)
		}
	}, [])
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
			const newItems = [...staticItems, ...pluginItems]
			setItems(newItems)
			notify(newItems)
		} catch (e) {
			console.error('Failed to refresh plugins:', e)
		}
	}, [notify])
	return {
		items,
		setItems,
		subscribe,
		refreshFromBackend,
	}
}
const pluginItemsState = (() => {
	let state: ReturnType<typeof usePluginItemsInternal> | null = null
	const listeners: Listener[] = []
	let items: ItemType[] = staticItems
	return {
		setState(s: ReturnType<typeof usePluginItemsInternal>) {
			state = s
			items = s.items
		},
		getItems() {
			return state ? state.items : items
		},
		getItemById(id: string) {
			return (state ? state.items : items).find((item) => item.id === id)
		},
		getItemIndexById(id: string) {
			return (state ? state.items : items).findIndex((item) => item.id === id)
		},
		subscribe(listener: Listener) {
			if (state) return state.subscribe(listener)
			listeners.push(listener)
			return () => {
				const idx = listeners.indexOf(listener)
				if (idx !== -1) listeners.splice(idx, 1)
			}
		},
		refreshFromBackend() {
			if (state) return state.refreshFromBackend()
		},
		_listeners: listeners,
	}
})()
export function usePluginItems(): ItemType[] {
	const pluginState = usePluginItemsInternal()
	useEffect(() => {
		pluginItemsState.setState(pluginState)
		for (const l of pluginItemsState._listeners) {
			l(pluginState.items)
		}
		pluginItemsState._listeners.length = 0
	}, [pluginState, pluginState.items])
	useEffect(() => {
		pluginState.refreshFromBackend()
	}, [pluginState.refreshFromBackend])
	return pluginState.items
}
export const getItemById = (id: string): ItemType | undefined => {
	return pluginItemsState.getItemById(id)
}
export const getItemIndexById = (id: string): number => {
	return pluginItemsState.getItemIndexById(id)
}
export { PluginUIRenderer }
