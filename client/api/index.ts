import { connect } from '../../services/connect'

const request = {
	create: connect.create,
	retrieve: connect.retrieve,
	update: connect.update,
	delete: connect.delete,
}

export const api = {
	request,
}
