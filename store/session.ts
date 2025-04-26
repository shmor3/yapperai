import { createSessionStorage } from 'react-router'

function createDatabaseSessionStorage({ cookie, host, port }) {
  const db = createDatabaseClient(host, port)
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const id = await db.insert(data)
      return id
    },
    async readData(id) {
      return (await db.select(id)) || null
    },
    async updateData(id, data, expires) {
      await db.update(id, data)
    },
    async deleteData(id) {
      await db.delete(id)
    },
  })
}
