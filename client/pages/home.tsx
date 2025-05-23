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
export const Home: React.FC = () => {
	const { bears, increasePopulation, decreasePopulation, removeAllBears } =
		useBearContext()
	const [greetMsg, setGreetMsg] = useState<string>('')
	const [name, setName] = useState<string>('')
	const [sum, setSum] = useState<string>('')
	const [vars, setVars] = useState<[number, number]>([0, 0])
	const greet = useCallback(async () => {
		try {
			const message = await greeting(name)
			const calculatedSum = await math(vars[0], vars[1])
			setSum(calculatedSum.toString())
			setGreetMsg(message)
		} catch (error) {
			setGreetMsg(`An error occurred while processing. ${error}`)
		}
	}, [name, vars])
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
	const request = async () => {
		const message = {
			version: Number('0.0.1'),
			endpoint: '/api/v1/greet',
			payload: '',
		}
		const data = await api.connrpc.retrieve(message)
		return { data }
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
				<button className='btn btn-accent' type='button' onClick={request}>
					api
				</button>
			</div>
		</div>
	)
}
