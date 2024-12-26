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

const calculateChanges = (nums: number[]) => {
	const changes = [];
	for (let i = 1; i < nums.length; i++) {
		changes.push(nums[i] - nums[i - 1]);
	}
	return changes;
};

export function solve(input: string): number {
	const lines = input.split("\n");

	let best = 0;

	const priceBySequence: Map<string, number> = new Map();

	for (const line of lines) {
		let secret = parseInt(line);
		const history = [secret];
		const seenSequences = new Set<string>();
		for (let i = 0; i < 2000; i++) {
			secret = evolveNumber(secret);
			// price is the ones-digit of the secret number
			const price = secret % 10;
			history.push(price);

			if (history.length >= 5) {
				const changes = calculateChanges(history.slice(-5));
				const sequence = changes.join(",");

				// only take the price of the first occurrence of a sequence
				if (seenSequences.has(sequence)) {
					continue;
				}
				seenSequences.add(sequence);

				const existing = priceBySequence.get(sequence) ?? 0;
				const newSum = existing + price;
				priceBySequence.set(sequence, newSum);

				if (newSum > best) {
					best = newSum;
				}
			}
		}
	}

	return best;
}
