import type { useBearStore } from '@client/state/bears'
import { invoke } from '@tauri-apps/api/core'
import { type FormEvent, useCallback, useState } from 'react'

const greeting = async (name: string): Promise<string> => {
	const message = await invoke<string>('greet', { name })
	return Promise.resolve(message)
}

type BearState = ReturnType<typeof useBearStore.getState>

interface HomeProps extends BearState {}

export function Home({
	bears,
	increasePopulation,
	decreasePopulation,
	removeAllBears,
}: HomeProps) {
	const [greetMsg, setGreetMsg] = useState<string>('')
	const [name, setName] = useState<string>('')

	const greet = useCallback(async () => {
		try {
			const message = await greeting(name)
			setGreetMsg(message)
		} catch (error) {
			console.error('Error invoking greet:', error)
			setGreetMsg('An error occurred while greeting.')
		}
	}, [name])

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		console.log(name)
		e.preventDefault()
		if (!name) {
			setGreetMsg('Please enter a name.')
			return
		}
		greet()
	}

	return (
		<div className='flex flex-col w-full h-full items-center justify-center'>
			<div className='flex flex-row'>
				<form className='flex flex-row' onSubmit={handleSubmit}>
					<input
						className='input'
						value={name}
						onChange={(e) => setName(e.currentTarget.value)}
						placeholder='Enter a name...'
					/>
					<button className='btn' type='submit'>
						Greet
					</button>
				</form>
			</div>
			<p className='p-5'>Message: {greetMsg}</p>
			<div className='flex flex-row'>
				<button className='btn' type='button' onClick={increasePopulation}>
					+
				</button>
				<button className='btn' type='button' onClick={decreasePopulation}>
					-
				</button>
				<button className='btn' type='button' onClick={removeAllBears}>
					--
				</button>
			</div>
			<p className='p-5'>Count: {bears}</p>
		</div>
	)
}
