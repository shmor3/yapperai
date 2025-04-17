export const getApiUrl = () => {
	return String(`http://${process.env.HOST}:${process.env.PORT}/api`) ?? '/api'
}
