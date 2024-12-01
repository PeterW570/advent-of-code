export function solve(input: string): number {
	const lines = input.split("\n");
	const leftFrequencies: Map<number, number> = new Map();
	const rightFrequencies: Map<number, number> = new Map();

	for (const line of lines) {
		const splits = line.split(/\s+/);
		if (splits.length !== 2) {
			throw new Error("Invalid input");
		}
		const leftNum = parseInt(splits[0]);
		const rightNum = parseInt(splits[1]);

		const existingLeft = leftFrequencies.get(leftNum);
		leftFrequencies.set(leftNum, (existingLeft ?? 0) + 1);

		const existingRight = rightFrequencies.get(rightNum);
		rightFrequencies.set(rightNum, (existingRight ?? 0) + 1);
	}

	let similarityScore = 0;

	for (const [num, freq] of leftFrequencies) {
		similarityScore += freq * num * (rightFrequencies.get(num) ?? 0);
	}

	return similarityScore;
}
