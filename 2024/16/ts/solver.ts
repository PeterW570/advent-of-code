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

const posToString = (pos: Pos) => `${pos.row},${pos.col}`;

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
	posStr: string;
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
function dijkstra({ map, rows, cols, source, target }: PuzzleState) {
	const distances: Record<string, number> = {};
	const previous: Record<string, string> = {};
	const visited = new Set<string>();
	const queue: QueueItem[] = [
		{
			pos: source,
			posStr: posToString(source),
			dir: Direction.Right,
		},
	];

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const obj = map[row][col];
			if (obj === MapObject.Wall) {
				continue;
			}

			const posStr = posToString({ row, col });
			distances[posStr] = Infinity;
		}
	}
	distances[posToString(source)] = 0;

	let iterations = 0;
	while (queue.length && iterations < 10_000) {
		iterations++;
		queue.sort((a, b) =>
			distances[a.posStr] < distances[b.posStr]
				? -1
				: distances[a.posStr] > distances[b.posStr]
				? 1
				: 0
		);
		const current = queue.shift()!;

		if (current.posStr === posToString(target)) break;
		else if (visited.has(current.posStr)) continue;

		for (const dir of dirs) {
			const [rowDiff, colDiff] = offsetsForDir[dir];
			const nextPos: Pos = {
				row: current.pos.row + rowDiff,
				col: current.pos.col + colDiff,
			};
			const nextPosStr = posToString(nextPos);
			if (visited.has(nextPosStr)) {
				continue;
			} else if (map[nextPos.row][nextPos.col] === MapObject.Wall) {
				continue;
			}

			let cost = distances[current.posStr];
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
				posStr: nextPosStr,
				dir,
			});

			if (cost < distances[nextPosStr]) {
				distances[nextPosStr] = cost;
				previous[nextPosStr] = current.posStr;
			}
		}

		visited.add(current.posStr);
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

	const { distances } = dijkstra(intialState);

	return distances[posToString(endPosition)];
}
