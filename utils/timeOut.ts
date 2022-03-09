//takes timeout in ms
export default function timeOut(timeout: number, ...args: Promise<any>[]) {
	function timeOut() {
		return new Promise((res, rej) => setTimeout(rej, timeout, new Error(`Timed out after ${timeout}ms`)));
	}
	return Promise.race([...args, timeOut()]);
}
