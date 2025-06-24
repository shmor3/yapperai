import { useBearContext } from '@state/bears'
import { type FormEvent, useCallback, useState } from 'react'
import { api } from '@client/api'
const greeting = async (name: string): Promise<string> => {
	const message = await invoke<string>('greet', { name })
	return message
}
const math = async (a: number, b: number): Promise<number> => {
	const sum = await invoke<number>('sum', { a, b })
	return sum
}
const request = async (endpoint: string, payload: string): Promise<string> => {
	const message = {
		version: Number('0.0.1'),
		endpoint: endpoint,
		payload: payload,
	}
	const data = await api.connrpc.retrieve(message)
	return String(data)
}
export const Home: React.FC = () => {
	const { bears, increasePopulation, decreasePopulation, removeAllBears } =
		useBearContext()
	const [greetMsg, setGreetMsg] = useState<string>('')
	const [name, setName] = useState<string>('')
	const [sum, setSum] = useState<string>('')
	const [vars, setVars] = useState<[number, number]>([0, 0])
	const [uri, setRes] = useState<string>('')

	const greet = useCallback(async () => {
		try {
			const message = await greeting(name)
			setGreetMsg(message)
		} catch (error) {
			setGreetMsg(`An error occurred while processing. ${error}`)
		}
	}, [name])
	const calculate = useCallback(async () => {
		try {
			const calculatedSum = await math(vars[0], vars[1])
			setSum(calculatedSum.toString())
		} catch (error) {
			setSum(`An error occurred while processing. ${error}`)
		}
	}, [vars])
	const handleNameSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!name) {
			setGreetMsg('Please enter a name.')
			return
		}
		greet()
	}
	const handleMathSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (vars[0] === undefined || vars[1] === undefined) {
			setSum('Please enter both numbers.')
			return
		}
		calculate()
	}
	const clearAll = () => {
		setName('')
		setVars([0, 0])
		setGreetMsg('')
		setSum('')
		removeAllBears()
	}

	const newReq = useCallback(async () => {
		try {
			const res = await request(uri, 'Hello World')
			setRes(res.toString())
		} catch (error) {
			setRes(`An error occurred while processing. ${error}`)
		}
	}, [uri])

	const handleReqSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!uri) {
			setRes('Please enter an endpoint.')
			return
		}
		newReq()
	}

	return (
		<div className='flex flex-col w-full h-full items-center justify-center space-y-6'>
			<p className='text-lg'>Bears: {bears}</p>
			<p className='text-lg'>{greetMsg || 'Enter a name!'}</p>
			<p className='text-lg'>
				{`${vars[0]} + ${vars[1]} = `}
				{sum || '?'}
			</p>
			<form className='flex flex-row space-x-2' onSubmit={handleNameSubmit}>
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
			<form className='flex flex-row space-x-2' onSubmit={handleMathSubmit}>
				<input
					className='input input-bordered w-32'
					type='number'
					value={vars[0]}
					onChange={(e) => setVars([Number(e.target.value), vars[1]])}
					placeholder='First number'
				/>
				<input
					className='input input-bordered w-32'
					type='number'
					value={vars[1]}
					onChange={(e) => setVars([vars[0], Number(e.target.value)])}
					placeholder='Second number'
				/>
				<button className='btn btn-primary' type='submit'>
					Calculate
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
					Clear All
				</button>
			</div>
			<div className='flex flex-row space-x-2'>
				<form className='flex flex-row space-x-2' onSubmit={handleReqSubmit}>
					<input
						className='input input-bordered w-64'
						value={uri}
						onChange={(e) => setRes(e.currentTarget.value)}
						placeholder='Enter a uri...'
					/>
					<button className='btn btn-primary' type='submit'>
						api
					</button>
				</form>
			</div>
		</div>
	)
}
