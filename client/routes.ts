import {
	type RouteConfig,
	index,
	// layout,
	// route,
} from '@react-router/dev/routes'

export default [
	// layout('layouts/default.tsx', { id: 'source' }, [index('routes/source.tsx')]),
	// route(':page', 'layouts/default.tsx'),
	index('routes/source.tsx'),
] satisfies RouteConfig
