export const numericKeypad = [
	["7", "8", "9"],
	["4", "5", "6"],
	["1", "2", "3"],
	["", "0", "A"],
];

export const directionalKeypad = [
	["", "^", "A"],
	["<", "v", ">"],
];

function generateMovement(
	current: [number, number],
	target: [number, number],
	isNumKeypad: boolean
): string {
	const [currentX, currentY] = current;
	const [targetX, targetY] = target;

	const hDiff = targetX - currentX;
	const vDiff = targetY - currentY;

	const targetIsLeft = hDiff < 0;
	const targetIsAbove = vDiff < 0;

	const hMoves = (targetIsLeft ? "<" : ">").repeat(Math.abs(hDiff));
	const vMoves = (targetIsAbove ? "^" : "v").repeat(Math.abs(vDiff));

	const movements = targetIsLeft ? [hMoves, vMoves] : [vMoves, hMoves];

	const emptyButtonRow = isNumKeypad ? numericKeypad.length - 1 : 0;
	const emptyButtonCol = 0;

	const shouldReverseMovements =
		(currentX === emptyButtonCol || targetX === emptyButtonCol) &&
		(currentY === emptyButtonRow || targetY === emptyButtonRow);

	return shouldReverseMovements ? movements.reverse().join("") : movements.join("");
}

const ROBOT_COUNT = 26;

const memoCache = new Map<string, Map<number, number>>();

const processSequenceRecursive = (sequence: string, robotNumber: number): Map<number, number> => {
	if (robotNumber > ROBOT_COUNT) return new Map([[sequence.length, 1]]);

	const cacheKey = `${sequence}-${robotNumber}`;
	if (memoCache.has(cacheKey)) return memoCache.get(cacheKey)!;

	const keypad = robotNumber === 1 ? numericKeypad : directionalKeypad;

	const nextLengthCounts = sequence.split("").reduce((acc, item, i) => {
		const nextCounts = processSequenceRecursive(
			generateMovement(
				[
					keypad
						.find((row) => row.includes(i === 0 ? "A" : sequence[i - 1]))!
						.indexOf(i === 0 ? "A" : sequence[i - 1]),
					keypad.findIndex((row) => row.includes(i === 0 ? "A" : sequence[i - 1])),
				],
				[
					keypad.find((row) => row.includes(item))!.indexOf(item),
					keypad.findIndex((row) => row.includes(item)),
				],
				keypad === numericKeypad
			) + "A",
			robotNumber + 1
		);

		for (const [length, count] of nextCounts) {
			acc.set(length, (acc.get(length) || 0) + count);
		}

		return acc;
	}, new Map<number, number>());

	memoCache.set(cacheKey, nextLengthCounts);
	return nextLengthCounts;
};

export function solve(input: string): number {
	const lines = input.split("\n");

	let complexitySum = 0;

	for (const line of lines) {
		const lengthCounts = processSequenceRecursive(line, 1);

		let total = 0;
		lengthCounts.forEach((count, length) => (total += parseInt(line) * length * count));

		complexitySum += total;
	}

	return complexitySum;
}
