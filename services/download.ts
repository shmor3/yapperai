import { download } from '@tauri-apps/plugin-upload'
// when using `"withGlobalTauri": true`, you may use
// const { download } = window.__TAURI__.upload;

download(
	'https://example.com/file-download-link',
	'./path/to/save/my/file.txt',
	({ progress, total }) =>
		console.log(`Downloaded ${progress} of ${total} bytes`), // a callback that will be called with the download progress
	new Map([['Content-Type', 'text/plain']]), // optional headers to send with the request
)
