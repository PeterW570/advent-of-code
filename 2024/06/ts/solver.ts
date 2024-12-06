const dirs = [
	[-1, 0],
	[0, 1],
	[1, 0],
	[0, -1],
];

type Pos = { row: number; col: number };

function hasLoop(lines: string[], startPos: Pos): [boolean, Set<string>] {
	const visited = new Set<string>();
	let currentDirIdx = 0;
	let currentPos = startPos;
	while (true) {
		const key = `${currentPos.row},${currentPos.col},${currentDirIdx}`;
		if (visited.has(key)) {
			return [true, visited];
		}
		visited.add(key);

		const currentDir = dirs[currentDirIdx];
		const nextPos = [currentPos.row + currentDir[0], currentPos.col + currentDir[1]];

		const nextCell = lines[nextPos[0]]?.[nextPos[1]];
		if (nextCell === "#") {
			currentDirIdx = (currentDirIdx + 1) % dirs.length;
		} else if (nextCell) {
			currentPos = { row: nextPos[0], col: nextPos[1] };
		} else {
			return [false, visited];
		}
	}
}

export function solve(input: string): number {
	const lines = input.split("\n");
	const rows = lines.length;
	const cols = lines[0].length;

	const obstacles = new Set<string>();
	let startRow: number | undefined = undefined;
	let startCol: number | undefined = undefined;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = lines[row][col];
			if (cell === "#") {
				obstacles.add(`${row},${col}`);
			} else if (cell === "^") {
				startRow = row;
				startCol = col;
			}
		}
	}

	if (startRow === undefined || startCol === undefined) throw new Error("start pos not set");

	let loops = 0;
	const [, initialVisited] = hasLoop(lines, { row: startRow, col: startCol });
	const addedObstacleLocations = new Set([`${startRow},${startCol}`]);
	for (const key of initialVisited) {
		const [row, col] = key.split(",");
		if (addedObstacleLocations.has(`${row},${col}`)) continue;

		const newLines = lines.map((line, x) =>
			x === parseInt(row)
				? line
						.split("")
						.map((cell, y) => (y === parseInt(col) ? "#" : cell))
						.join("")
				: line
		);
		const [newRouteHasLoop] = hasLoop(newLines, { row: startRow, col: startCol });
		if (newRouteHasLoop) loops++;
		addedObstacleLocations.add(`${row},${col}`);
	}

	return loops;
}
