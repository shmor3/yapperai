import WebSocket from 'isomorphic-ws'

globalThis.WebSocket = WebSocket as unknown as typeof globalThis.WebSocket
