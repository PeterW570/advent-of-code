export function solve(input: string): number {
	const lines = input.split("\n");
	const leftNums = [];
	const rightNums = [];

	for (const line of lines) {
		const splits = line.split(/\s+/);
		if (splits.length !== 2) {
			throw new Error("Invalid input");
		}
		leftNums.push(parseInt(splits[0]));
		rightNums.push(parseInt(splits[1]));
	}

	leftNums.sort((a, b) => a - b);
	rightNums.sort((a, b) => a - b);

	let diffSum = 0;

	for (let i = 0; i < leftNums.length; i++) {
		const left = leftNums[i];
		const right = rightNums[i];
		diffSum += Math.abs(left - right);
	}

	return diffSum;
}
