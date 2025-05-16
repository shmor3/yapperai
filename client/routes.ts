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
] satisfies RouteConfig
