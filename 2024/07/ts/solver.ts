function canCalculateTarget(target: number, initialValue: number, values: number[]): boolean {
	if (initialValue > target) return false;

	const [nextVal, ...remaining] = values;

	const added = initialValue + nextVal;
	const multiplied = initialValue * nextVal;

	if (remaining.length) {
		return (
			canCalculateTarget(target, added, remaining) ||
			canCalculateTarget(target, multiplied, remaining)
		);
	} else {
		return added === target || multiplied === target;
	}
}

export function solve(input: string): number {
	const lines = input.split("\n");

	let total = 0;
	for (const line of lines) {
		const [targetStr, remaining] = line.split(": ");
		const valuesStrs = remaining.split(" ");

		const target = parseInt(targetStr);
		const values = valuesStrs.map((x) => parseInt(x));

		if (canCalculateTarget(target, values[0], values.slice(1))) {
			total += target;
		}
	}

	return total;
}
