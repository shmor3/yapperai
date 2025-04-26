import { useBearContext } from '@client/state/bears'
import { invoke } from '@tauri-apps/api/core'
import { type FormEvent, useCallback, useState } from 'react'
const greeting = async (name: string): Promise<string> => {
	const message = await invoke<string>('greet', { name })
	const sum = await invoke<string>('math', { a: 1, b: 2 })
	return Promise.resolve(`${message} ${sum}`)
}
export function Home({ loader }: { loader: boolean }) {
	if (!loader) {
		console.error('Loader data is not ready:', loader)
	}
	const { bears, increasePopulation, decreasePopulation, removeAllBears } =
		useBearContext()
	const [greetMsg, setGreetMsg] = useState<string>('')
	const [name, setName] = useState<string>('')
	const greet = useCallback(async () => {
		try {
			const message = await greeting(name)
			setGreetMsg(message)
		} catch (error) {
			setGreetMsg('An error occurred while greeting.')
		}
	}, [name])
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!name) {
			setGreetMsg('Please enter a name.')
			return
		}
		greet()
	}
	const clearAll = () => {
		setName('')
		setGreetMsg('')
		removeAllBears()
	}
	return (
		<div className='flex flex-col w-full h-full items-center justify-center space-y-6'>
			<p className='text-lg'>Bears: {bears}</p>
			<p className='text-lg'>{greetMsg || 'Enter a name!'}</p>
			<form className='flex flex-row space-x-2' onSubmit={handleSubmit}>
				<input
					className='input input-bordered w-64'
					value={name}
					onChange={(e) => setName(e.currentTarget.value)}
					placeholder='Enter a name...'
				/>
				<button className='btn btn-primary' type='submit'>
					Greet
				</button>
			</form>
			<div className='flex flex-row space-x-2'>
				<button
					className='btn btn-secondary'
					type='button'
					onClick={increasePopulation}
				>
					+
				</button>
				<button
					className='btn btn-secondary'
					type='button'
					onClick={decreasePopulation}
				>
					-
				</button>
				<button className='btn btn-accent' type='button' onClick={clearAll}>
					x
				</button>
			</div>
		</div>
	)
}
