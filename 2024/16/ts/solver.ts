enum MapObject {
	Wall = "#",
	Empty = ".",
	Start = "S",
	End = "E",
}

type Pos = {
	row: number;
	col: number;
};

const posDirToString = (pos: Pos, dir: Direction) => `${pos.row},${pos.col},${dir}`;

enum Direction {
	Up = "^",
	Right = ">",
	Down = "v",
	Left = "<",
}

const dirs = [Direction.Up, Direction.Right, Direction.Down, Direction.Left];

const offsetsForDir = {
	[Direction.Up]: [-1, 0],
	[Direction.Right]: [0, 1],
	[Direction.Down]: [1, 0],
	[Direction.Left]: [0, -1],
} as const;

interface QueueItem {
	posDirStr: string;
	pos: Pos;
	dir: Direction;
}

type PuzzleStateMap = Record<number, Record<number, MapObject>>;
interface PuzzleState {
	map: PuzzleStateMap;
	source: Pos;
	target: Pos;
	rows: number;
	cols: number;
}

// https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#
function dijkstra({ map, source }: PuzzleState) {
	const distances: Partial<Record<string, number>> = {};
	const previous: Partial<Record<string, Set<string>>> = {};
	const visited = new Set<string>();
	const queue: QueueItem[] = [
		{
			pos: source,
			posDirStr: posDirToString(source, Direction.Right),
			dir: Direction.Right,
		},
		{
			pos: source,
			posDirStr: posDirToString(source, Direction.Up),
			dir: Direction.Up,
		},
	];

	distances[posDirToString(source, Direction.Right)] = 0;
	distances[posDirToString(source, Direction.Up)] = 1000;

	while (queue.length) {
		queue.sort((a, b) =>
			(distances[a.posDirStr] ?? Infinity) < (distances[b.posDirStr] ?? Infinity)
				? -1
				: (distances[a.posDirStr] ?? Infinity) > (distances[b.posDirStr] ?? Infinity)
				? 1
				: 0
		);
		const current = queue.shift()!;

		if (visited.has(current.posDirStr)) continue;

		const [currentRowDiff, currentColDiff] = offsetsForDir[current.dir];
		const nextPos: Pos = {
			row: current.pos.row + currentRowDiff,
			col: current.pos.col + currentColDiff,
		};
		if (map[nextPos.row][nextPos.col] === MapObject.Wall) {
			continue;
		}

		for (const dir of dirs) {
			const [rowDiff, colDiff] = offsetsForDir[dir];
			const nextPosDirStr = posDirToString(nextPos, dir);
			if (visited.has(nextPosDirStr)) {
				continue;
			}

			let cost = distances[current.posDirStr]!;
			const [currentRowDiff, currentColDiff] = offsetsForDir[current.dir];

			if (rowDiff === currentRowDiff && colDiff === currentColDiff) {
				// continuing direction
				cost += 1;
			} else if (rowDiff !== currentRowDiff && colDiff !== currentColDiff) {
				// rotating 90 degrees
				cost += 1001;
			} else {
				// can't turn 180 degrees
				continue;
			}

			queue.push({
				pos: nextPos,
				posDirStr: nextPosDirStr,
				dir,
			});

			if (!distances[nextPosDirStr] || cost < distances[nextPosDirStr]) {
				distances[nextPosDirStr] = cost;
				const prevSet = new Set<string>();
				prevSet.add(current.posDirStr);
				previous[nextPosDirStr] = prevSet;
			} else if (cost === distances[nextPosDirStr]) {
				previous[nextPosDirStr]!.add(current.posDirStr);
			}
		}

		visited.add(current.posDirStr);
	}

	return { distances, previous };
}

export function solve(input: string): number {
	const lines = input.split("\n");

	const map: PuzzleStateMap = {};
	const rows = lines.length;
	const cols = lines[0].length;
	let startPosition: Pos | null = null;
	let endPosition: Pos | null = null;

	for (let row = 0; row < rows; row++) {
		map[row] = {};
		for (let col = 0; col < cols; col++) {
			const x = lines[row][col] as MapObject;
			map[row][col] = x;

			if (x === MapObject.Start) {
				startPosition = { row, col };
			} else if (x === MapObject.End) {
				endPosition = { row, col };
			}
		}
	}

	if (!startPosition) throw new Error("Couldn't find start");
	if (!endPosition) throw new Error("Couldn't find end");

	const intialState: PuzzleState = {
		map,
		source: startPosition,
		target: endPosition,
		rows,
		cols,
	};

	const { distances, previous } = dijkstra(intialState);

	const visitedPosDirs = new Set<string>();
	const partOfBestPaths = new Set<string>();
	let min = Infinity;
	for (const dir of dirs) {
		const targetPosDir = posDirToString(endPosition, dir);
		if (distances[targetPosDir] && distances[targetPosDir] < min) {
			min = distances[targetPosDir];
		}
	}
	const queue = dirs
		.map((dir) => posDirToString(endPosition, dir))
		.filter((posDirStr) => distances[posDirStr] && distances[posDirStr] === min);

	while (queue.length) {
		const first = queue.shift()!;
		if (visitedPosDirs.has(first)) continue;
		else if (!previous[first]) continue;

		queue.push(...previous[first]);
		visitedPosDirs.add(first);
		partOfBestPaths.add(first.slice(0, -2));
	}

	// _debugBestPath(intialState, partOfBestPaths);

	return partOfBestPaths.size + 1;
}

function _debugBestPath({ rows, cols, map }: PuzzleState, partOfBestPaths: Set<string>) {
	for (let row = 0; row < rows; row++) {
		let rowStr = "";
		for (let col = 0; col < cols; col++) {
			if (partOfBestPaths.has(`${row},${col}`)) {
				rowStr += "O";
			} else {
				rowStr += map[row][col];
			}
		}
		console.log(rowStr);
	}
	console.log("");
}
