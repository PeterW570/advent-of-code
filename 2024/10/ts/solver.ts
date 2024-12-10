type Pos = { row: number; col: number };

const dirs = [
	[1, 0],
	[0, 1],
	[-1, 0],
	[0, -1],
];

function findTrailPeaks(lines: string[], pos: Pos): number {
	let peaks = 0;

	const currentValue = parseInt(lines[pos.row][pos.col]);

	for (const dir of dirs) {
		const nextPos: Pos = {
			row: pos.row + dir[0],
			col: pos.col + dir[1],
		};
		const possibleNext = parseInt(lines[nextPos.row]?.[nextPos.col]);
		if (isNaN(possibleNext)) continue;

		if (possibleNext === currentValue + 1) {
			if (possibleNext === 9) {
				peaks++;
			} else {
				peaks += findTrailPeaks(lines, nextPos);
			}
		}
	}

	return peaks;
}

export function solve(input: string): number {
	const lines = input.split("\n");
	const rows = lines.length;
	const cols = lines[0].length;

	let sum = 0;

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = lines[row][col];
			if (cell === "0") {
				sum += findTrailPeaks(lines, { row, col });
			}
		}
	}

	return sum;
}
