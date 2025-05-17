import type { InvokeArgs, InvokeOptions } from '@tauri-apps/api/core'

declare global {
	function invoke<T>(
		cmd: string,
		args?: InvokeArgs,
		options?: InvokeOptions,
	): Promise<T>
}
