export function getToday() {
	return new Date(Date.now()).toISOString().slice(0, 10)
}

export function getNow() {
	return new Date(Date.now())
}
