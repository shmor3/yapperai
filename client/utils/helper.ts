import { v4 } from 'uuid'

const sleep = (n = 500) => new Promise((r) => setTimeout(r, n))
const uuid = () => v4()

export { sleep, uuid }
