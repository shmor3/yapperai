import {
	type RouteConfig,
	index,
	layout,
	route,
} from '@react-router/dev/routes'

export default [
	layout('layouts/default.tsx', { id: 'source' }, [index('routes/source.tsx')]),
	layout('layouts/splash.tsx', { id: 'startup' }, [
		route('splash', 'routes/splash.tsx', { id: 'splash' }),
	]),
	// layout('layouts/endpoint.tsx', { id: 'api' }, [
	// 	route('api/:version/:endpoint/*', 'routes/endpoint.tsx', {
	// 		id: 'endpoint',
	// 	}),
	// ]),
] satisfies RouteConfig
