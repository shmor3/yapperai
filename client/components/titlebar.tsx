import { DashIcon, SquareIcon, XIcon } from '@primer/octicons-react'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useCallback, useEffect, useState } from 'react'
export const TitleBar: React.FC = () => {
	const [window, setWindow] = useState<Awaited<
		ReturnType<typeof getCurrentWindow>
	> | null>(null)
	const [isMaximized, setIsMaximized] = useState(false)
	useEffect(() => {
		const fetchWindow = async () => {
			const currentWindow = await getCurrentWindow()
			setWindow(currentWindow)
		}
		fetchWindow()
	}, [])
	const updateMaximizedStatus = useCallback(async () => {
		if (window) {
			const maximized = await window.isMaximized()
			setIsMaximized(maximized)
		}
	}, [window])
	useEffect(() => {
		if (window) {
			updateMaximizedStatus()
			const unlistenMaximize = window.onResized(updateMaximizedStatus)
			return () => {
				unlistenMaximize.then((unlisten: () => void) => unlisten())
			}
		}
	}, [window, updateMaximizedStatus])
	const minimize = async () => {
		await window?.minimize()
	}
	const toggleMaximize = async () => {
		await window?.toggleMaximize()
		updateMaximizedStatus()
	}
	const close = async () => {
		await window?.close()
	}
	const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
		if (event.key === 'Enter' || event.key === ' ') {
			action()
		}
	}
	return (
		<div className='fixed left-0 right-0 top-0 flex h-12 w-full items-center bg-base-300 shadow-sm'>
			<div
				data-tauri-drag-region
				className='h-[30px] bg-base-300 select-none flex justify-end fixed top-0 left-0 right-0'
			>
				<button
					type='button'
					className='btn btn-ghost inline-flex justify-center items-center w-[30px] h-[30px] select-none hover:bg-base-100'
					id='titlebar-minimize'
					onClick={minimize}
					onKeyDown={(e) => handleKeyDown(e, minimize)}
					aria-label='minimize'
				>
					<DashIcon size={16} />
				</button>
				<button
					type='button'
					className='btn btn-ghost inline-flex justify-center items-center w-[30px] h-[30px] select-none hover:bg-base-100'
					id='titlebar-maximize'
					onClick={toggleMaximize}
					onKeyDown={(e) => handleKeyDown(e, toggleMaximize)}
					aria-label={isMaximized ? 'restore' : 'maximize'}
				>
					<SquareIcon size={16} />
				</button>
				<button
					type='button'
					className='btn btn-ghost inline-flex justify-center items-center w-[30px] h-[30px] select-none hover:bg-base-100'
					id='titlebar-close'
					onClick={close}
					onKeyDown={(e) => handleKeyDown(e, close)}
					aria-label='close'
				>
					<XIcon size={16} />
				</button>
			</div>
		</div>
	)
}
