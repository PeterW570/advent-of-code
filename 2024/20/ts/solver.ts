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
const posToStr = (pos: Pos) => `${pos.row},${pos.col}`;
const strToPos = (str: string) => {
	const [rowStr, colStr] = str.split(",");
	return {
		row: parseInt(rowStr),
		col: parseInt(colStr),
	};
};

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
}

type PuzzleStateMap = Record<number, Record<number, MapObject>>;
interface PuzzleState {
	map: PuzzleStateMap;
	rows: number;
	cols: number;
}

// https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#
function dijkstra({ map }: PuzzleState, source: Pos) {
	const distances: Partial<Record<string, number>> = {};
	const previous: Partial<Record<string, string>> = {};
	const visited = new Set<string>();
	const queue: QueueItem[] = [
		{
			pos: source,
			posStr: posToStr(source),
		},
	];

	distances[posToStr(source)] = 0;

	while (queue.length) {
		queue.sort((a, b) =>
			(distances[a.posStr] ?? Infinity) < (distances[b.posStr] ?? Infinity)
				? -1
				: (distances[a.posStr] ?? Infinity) > (distances[b.posStr] ?? Infinity)
				? 1
				: 0
		);
		const current = queue.shift()!;

		if (visited.has(current.posStr)) continue;

		const currentDist = distances[current.posStr]!;

		for (const dir of dirs) {
			const [rowDiff, colDiff] = offsetsForDir[dir];
			const nextPos: Pos = {
				row: current.pos.row + rowDiff,
				col: current.pos.col + colDiff,
			};
			const nextPosStr = posToStr(nextPos);
			if (visited.has(nextPosStr)) {
				continue;
			}

			if (map[nextPos.row][nextPos.col] === MapObject.Wall) {
				continue;
			}

			queue.push({
				pos: nextPos,
				posStr: nextPosStr,
			});

			if (!distances[nextPosStr] || currentDist + 1 < distances[nextPosStr]) {
				distances[nextPosStr] = currentDist + 1;
				previous[nextPosStr] = current.posStr;
			}
		}

		visited.add(current.posStr);
	}

	return { distances, previous };
}

export function solve(input: string, targetSaving = 100): number {
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

	const { distances: distancesFromStart, previous } = dijkstra(
		{ map, rows, cols },
		startPosition
	);
	const { distances: distancesFromEnd } = dijkstra({ map, rows, cols }, endPosition);

	const bestPath: string[] = [];
	let posStr = posToStr(endPosition);
	while (previous[posStr] || posStr === posToStr(startPosition)) {
		bestPath.unshift(posStr);
		posStr = previous[posStr]!;
	}
	const bestPathLength = bestPath.length;

	let goodCheatCount = 0;

	for (const currentPosStr of bestPath.slice(0, -2)) {
		const currentPos = strToPos(currentPosStr);
		for (const dir of dirs) {
			const [rowDiff, colDiff] = offsetsForDir[dir];
			const nextPos: Pos = {
				row: currentPos.row + rowDiff,
				col: currentPos.col + colDiff,
			};

			// we now only care about walls
			if (map[nextPos.row][nextPos.col] !== MapObject.Wall) {
				continue;
			}

			const posAfterNext: Pos = {
				row: currentPos.row + 2 * rowDiff,
				col: currentPos.col + 2 * colDiff,
			};
			const posAfterNextStr = posToStr(posAfterNext);

			if (distancesFromStart[currentPosStr] === undefined) {
				continue;
			} else if (distancesFromEnd[posAfterNextStr] === undefined) {
				continue;
			}

			const potentialPathLength =
				distancesFromStart[currentPosStr] + distancesFromEnd[posAfterNextStr] + 2;
			if (potentialPathLength < bestPathLength - targetSaving) {
				goodCheatCount++;
			}
		}
	}

	return goodCheatCount;
}
