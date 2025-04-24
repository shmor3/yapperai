import type { useBearStore } from '@client/state/bears'
import type { Route } from '@rr/routes/+types/source'
import { invoke } from '@tauri-apps/api/core'
import { generatePageTitle } from '@utils/page-title'
import { type FormEvent, useCallback, useState } from 'react'
import type { MetaFunction } from 'react-router'

const greeting = async (name: string): Promise<string> => {
	const message = await invoke<string>('greet', { name })
	return Promise.resolve(message)
}

export const meta: MetaFunction = () => {
	return [{ title: generatePageTitle('Source') }]
}

export async function loader({ params }: Route.LoaderArgs) {
	const data = params.name
	return {
		data: data,
	}
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
		<div>
			<form onSubmit={handleSubmit}>
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
			<p className='p-5'>Message: {greetMsg}</p>
			<p className='p-5'>{bears} around here ...</p>
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
	)
}
