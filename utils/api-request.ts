import { getApiUrl } from '@utils/get-api-url'

export const apiRequest = async <ApiResponse>(
	path: `/${string}`,
	fetchOptions?: RequestInit,
) => {
	const base = getApiUrl()
	const url = `${base}${path}`
	const response = await fetch(url, fetchOptions)
	const json = (await response.json()) as ApiResponse
	const log = (await import('./logger')).log
	if (log) {
		log.debug(json, `request to ${url}`)
	}
	return json
}
