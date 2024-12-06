const dirs = [
	[-1, 0],
	[0, 1],
	[1, 0],
	[0, -1],
];

export function solve(input: string): number {
	const lines = input.split("\n");
	const rows = lines.length;
	const cols = lines[0].length;

	const obstacles = new Set<string>();
	let currentPos = { row: -1, col: -1 };
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = lines[row][col];
			if (cell === "#") {
				obstacles.add(`${row},${col}`);
			} else if (cell === "^") {
				currentPos.row = row;
				currentPos.col = col;
			}
		}
	}

	const visited = new Set<string>();
	let currentDirIdx = 0;
	while (true) {
		visited.add(`${currentPos.row},${currentPos.col}`);

		const currentDir = dirs[currentDirIdx];
		const nextPos = [currentPos.row + currentDir[0], currentPos.col + currentDir[1]];

		const nextCell = lines[nextPos[0]]?.[nextPos[1]];
		if (nextCell === "#") {
			currentDirIdx = (currentDirIdx + 1) % dirs.length;
		} else if (nextCell) {
			currentPos = { row: nextPos[0], col: nextPos[1] };
		} else {
			break;
		}
	}

	return visited.size;
}
