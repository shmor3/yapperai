import { redirect } from 'react-router'

export const NotFound: React.FC = () => {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<h1 className='mb-4 text-6xl font-bold text-neutral'>404</h1>
			<p className='mb-8 text-2xl text-gray-600'>Oops! Page not found.</p>
			<button type='button' className='btn' onClick={() => redirect('/')}>
				Go Home
			</button>
		</div>
	)
}
