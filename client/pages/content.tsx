import { invoke } from '@tauri-apps/api/core'
import { useState } from 'react'

export function Content() {
	const [greetMsg, setGreetMsg] = useState('')
	const [name, setName] = useState('')
	async function greet() {
		setGreetMsg(await invoke('greet', { name }))
	}
	return (
		<div>
			<form
				className='row'
				onSubmit={(e) => {
					e.preventDefault()
					greet()
				}}
			>
				<input
					className='input'
					id='greet-input'
					onChange={(e) => setName(e.currentTarget.value)}
					placeholder='Enter a name...'
				/>
				<button className='btn' type='submit'>
					Greet
				</button>
			</form>
			<p>{greetMsg}</p>
		</div>
	)
}
