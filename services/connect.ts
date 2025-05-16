interface Message {
	endpoint: string
	payload: string
}

export const connect = {
	create: async (data: Message) => {
		const res = await invoke<Message>('create', { data })
		return res
	},
	retrieve: async (dataId: Message) => {
		const res = await invoke<Message>('retrieve', { dataId })
		return res
	},
	update: async (data: Message) => {
		const res = await invoke<Message>('update', { data })
		return res
	},
	delete: async (dataId: Message) => {
		const res = await invoke<Message>('delete', { dataId })
		return res
	},
}
