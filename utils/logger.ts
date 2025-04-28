import {
	attachConsole,
	attachLogger,
	debug,
	error,
	info,
	trace,
	warn,
} from '@tauri-apps/plugin-log'
import pino from 'pino-http'
import type { Options } from 'pino-http'
// when using `"withGlobalTauri": true`, you may use
// const { warn, debug, trace, info, error, attachConsole, attachLogger } = window.__TAURI__.log;
const logLevel = process.env.LOG_LEVEL || 'info'

const loggerOptions: Record<'development' | 'production', Options> = {
	development: {
		level: logLevel,
		autoLogging: false,
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss',
				ignore: 'pid,hostname',
			},
		},
	},
	production: {
		level: logLevel,
	},
}

const env = (
	process.env.NODE_ENV === 'production' ? 'production' : 'development'
) as 'development' | 'production'
const opts = loggerOptions[env]
const log = pino(opts).logger

export { log }
