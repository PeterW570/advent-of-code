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

export function generateInstructions(code: string, keypad: string[][]): string {
	let instructions = "";
	let currentKey = "A";
	for (const targetKey of code) {
		if (targetKey === currentKey) {
			instructions += "A";
			continue;
		}

		instructions += generateMovement(
			[
				keypad.find((row) => row.includes(currentKey))!.indexOf(currentKey),
				keypad.findIndex((row) => row.includes(currentKey)),
			],
			[
				keypad.find((row) => row.includes(targetKey))!.indexOf(targetKey),
				keypad.findIndex((row) => row.includes(targetKey)),
			],
			keypad === numericKeypad
		);
		instructions += "A";
		currentKey = targetKey;
	}

	return instructions;
}

export function solve(input: string): number {
	const lines = input.split("\n");

	let complexitySum = 0;

	for (const line of lines) {
		const robotOneInstructions = generateInstructions(line, numericKeypad);
		const robotTwoInstructions = generateInstructions(robotOneInstructions, directionalKeypad);
		const personInstructions = generateInstructions(robotTwoInstructions, directionalKeypad);

		complexitySum += parseInt(line) * personInstructions.length;
	}

	return complexitySum;
}
