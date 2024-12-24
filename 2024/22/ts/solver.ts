function mix(num: number, secretNum: number) {
	return num ^ secretNum;
}

function mod(num: number, m: number) {
	return ((num % m) + m) % m;
}

function prune(secretNum: number) {
	return mod(secretNum, 16777216);
}

function evolveNumber(secretNum: number) {
	secretNum = prune(mix(secretNum * 64, secretNum));
	secretNum = prune(mix(Math.floor(secretNum / 32), secretNum));
	return prune(mix(secretNum * 2048, secretNum));
}

export function solve(input: string): number {
	const lines = input.split("\n");

	let secretSum = 0;

	for (const line of lines) {
		let secret = parseInt(line);
		for (let i = 0; i < 2000; i++) {
			secret = evolveNumber(secret);
		}
		secretSum += secret;
	}

	return secretSum;
}
