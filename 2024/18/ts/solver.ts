interface Pos {
	row: number;
	col: number;
}
const posToStr = ({ row, col }: Pos) => `${row},${col}`;
const strToPos = (str: string) => {
	const [rowStr, colStr] = str.split(",");
	return {
		row: parseInt(rowStr),
		col: parseInt(colStr),
	};
};

interface PuzzleState {
	size: number;
	corruptedMap: Partial<Record<number, Partial<Record<number, boolean>>>>;
	start: Pos;
	end: Pos;
}

const dirs = [
	[-1, 0],
	[0, 1],
	[1, 0],
	[0, -1],
];

class Queue {
	posStrs: Set<string>;
	scoreForPos: (pos: Pos) => number;

	constructor(startPos: Pos, h: (pos: Pos) => number) {
		this.posStrs = new Set<string>();
		this.scoreForPos = h;

		this.enqueue(startPos);
	}

	enqueue(pos: Pos) {
		const posStr = posToStr(pos);
		this.posStrs.add(posStr);
	}

	dequeue() {
		const sorted = Array.from(this.posStrs)
			.map((pos) => ({ pos, score: this.scoreForPos(strToPos(pos)) }))
			.sort((a, b) => a.score - b.score);

		const firstPosStr = sorted[0]?.pos;

		if (firstPosStr) {
			this.posStrs.delete(firstPosStr);
		}

		return strToPos(firstPosStr);
	}

	has(pos: Pos) {
		return this.posStrs.has(posToStr(pos));
	}

	any() {
		return this.posStrs.size > 0;
	}
}

function reconstructPath(from: Map<string, string>, current: Pos) {
	let currentStr = posToStr(current);
	const path = [currentStr];
	while (from.has(currentStr)) {
		currentStr = from.get(currentStr)!;
		path.unshift(currentStr);
	}
	return path;
}

// https://en.wikipedia.org/wiki/A*_search_algorithm
function aStar({ start, end, size, corruptedMap }: PuzzleState, bestPathPosSet?: Set<string>) {
	// For node n, gScore[n] is the currently known cost of the cheapest path from start to n.
	const gScore = new Map<string, number>();
	gScore.set(posToStr(start), 0);

	const h = (pos: Pos) =>
		(end.row - pos.row + end.col - pos.col) *
		(bestPathPosSet && !bestPathPosSet.has(posToStr(pos)) ? 100 : 1);

	// For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
	// how cheap a path could be from start to finish if it goes through n.
	const fScore = new Map<string, number>();
	fScore.set(posToStr(start), h(start));

	const openSet = new Queue(start, (pos) => fScore.get(posToStr(pos)) ?? Infinity);
	openSet.enqueue(start);

	const from: Map<string, string> = new Map();

	while (openSet.any()) {
		const current = openSet.dequeue()!;
		if (posToStr(current) === posToStr(end)) {
			return reconstructPath(from, current);
		}

		for (const dir of dirs) {
			const nextPos = {
				row: current.row + dir[0],
				col: current.col + dir[1],
			};
			if (nextPos.row < 0 || nextPos.row > size || nextPos.col < 0 || nextPos.col > size) {
				continue;
			}
			if (corruptedMap[nextPos.row]?.[nextPos.col]) {
				continue;
			}
			const nextPosStr = posToStr(nextPos);

			const tempGScore = gScore.get(posToStr(current))! + 1;
			if (tempGScore < (gScore.get(nextPosStr) ?? Infinity)) {
				from.set(nextPosStr, posToStr(current));
				gScore.set(nextPosStr, tempGScore);
				fScore.set(nextPosStr, tempGScore + h(nextPos));
				openSet.enqueue(nextPos);
			}
		}
	}

	throw new Error("Couldn't find path from start to end");
}

export function solve(input: string, memorySize = 70, bytes = 1024): string {
	const lines = input.split("\n");

	const puzzleState: PuzzleState = {
		size: memorySize,
		corruptedMap: {},
		start: { row: 0, col: 0 },
		end: { row: memorySize, col: memorySize },
	};

	for (let i = 0; i < bytes && i < lines.length; i++) {
		const [colStr, rowStr] = lines[i].split(",");
		const row = parseInt(rowStr);
		const col = parseInt(colStr);
		if (!puzzleState.corruptedMap[row]) {
			puzzleState.corruptedMap[row] = {};
		}
		puzzleState.corruptedMap[row][col] = true;
	}

	const bestPathPart1 = aStar(puzzleState);
	const bestPathPosSet = new Set(bestPathPart1);

	for (let i = bytes; i < lines.length; i++) {
		const [colStr, rowStr] = lines[i].split(",");
		const row = parseInt(rowStr);
		const col = parseInt(colStr);
		if (!puzzleState.corruptedMap[row]) {
			puzzleState.corruptedMap[row] = {};
		}
		puzzleState.corruptedMap[row][col] = true;

		if (bestPathPosSet.has(`${row},${col}`)) {
			try {
				aStar(puzzleState);
			} catch {
				return lines[i];
			}
		}
	}

	throw new Error("Couldn't find solution");
}

function _printMap({ size, corruptedMap }: PuzzleState) {
	for (let row = 0; row <= size; row++) {
		let rowStr = "";
		for (let col = 0; col <= size; col++) {
			if (corruptedMap[row]?.[col]) {
				rowStr += "#";
			} else {
				rowStr += ".";
			}
		}
		console.log(rowStr);
	}
}
