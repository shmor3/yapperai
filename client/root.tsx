import type { Route } from '@rr/+types/root'
import styles from '@styles/tailwind.css?url'
import { invoke as tauriInvoke } from '@tauri-apps/api/core'

import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
} from 'react-router'
if (typeof window !== 'undefined') {
	window.invoke = tauriInvoke
}

export const links: Route.LinksFunction = () => [
	{
		rel: 'preload',
		as: 'style',
		href: styles,
	},
	{
		rel: 'stylesheet',
		href: styles,
	},
]

export function Layout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App({ loaderData }: Route.ComponentProps) {
	if (loaderData.ready) {
		console.log('ok')
	}
	return (
		<Layout>
			<Outlet />
		</Layout>
	)
}

export const loader = async () => {
	return { ready: true }
}

export function HydrateFallback() {
	return (
		<main className='pt-16 p-4 container mx-auto'>
			<p>Skeleton rendered during SSR</p>
		</main>
	)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!'
	let details = 'An unexpected error occurred.'
	let stack: string | undefined
	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error'
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message
		stack = error.stack
	}
	return (
		<main className='pt-16 p-4 container mx-auto'>
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className='w-full p-4 overflow-x-auto'>
					<code>{stack}</code>
				</pre>
			)}
		</main>
	)
}
