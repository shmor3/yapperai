import { Container } from '@client/components/container'
import type { Route } from '@rr/routes/+types/source'
import { generatePageTitle } from '@utils/page-title'
import { type FormEvent, useCallback, useState } from 'react'
import type { MetaFunction } from 'react-router'

const greeting = (name: string): Promise<string> => {
	const message = `Hello, ${name}!`
	console.log(message)
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

export default function Source() {
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
		<main>
			<Container>
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
				</div>
			</Container>
		</main>
	)
}
