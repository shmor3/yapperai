import { createClient } from '@connectrpc/connect'
import { createConnectTransport } from '@connectrpc/connect-node'
import { DataService } from 'lunarbuf'

interface Message {
  version: number
  endpoint: string
  payload: string
}

const transport = createConnectTransport({
  baseUrl: 'http://localhost:3000',
  httpVersion: '2',
})

const client = createClient(DataService, transport)

export const connect = {
  create: async (data: Message) => {
    const res = await client.createData({ data: data.payload })
    return res.data
  },
  retrieve: async (dataId: Message) => {
    const res = await client.retrieveData({ dataId: dataId.payload })
    return res.data
  },
  update: async (data: Message) => {
    const res = await client.updateData({ data: data.payload })
    return res.data
  },
  delete: async (dataId: Message) => {
    const res = await client.deleteData({ dataId: dataId.payload })
    return res.data
  },
}
