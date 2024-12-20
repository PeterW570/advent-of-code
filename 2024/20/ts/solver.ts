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

type DistanceMap = Partial<Record<string, number>>;

// https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#
function dijkstra({ map }: PuzzleState, source: Pos) {
	const distances: DistanceMap = {};
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

const MAX_SHORTCUT_LENGTH = 20;

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

	const bestPath: string[] = [];
	let posStr = posToStr(endPosition);
	while (previous[posStr] || posStr === posToStr(startPosition)) {
		bestPath.unshift(posStr);
		posStr = previous[posStr]!;
	}

	let goodCheatCount = 0;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (map[row][col] === "#") continue;
			for (let r = 2; r <= MAX_SHORTCUT_LENGTH; r++) {
				for (let dy = 0; dy < r + 1; dy++) {
					const dx = r - dy;
					const dirset = new Set([
						`${row + dy},${col + dx}`,
						`${row + dy},${col - dx}`,
						`${row - dy},${col + dx}`,
						`${row - dy},${col - dx}`,
					]);
					for (const dir of dirset) {
						const [ny, nx] = dir.split(",").map(Number);
						if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
						if (map[ny][nx] === "#") continue;
						const d1 = distancesFromStart[`${row},${col}`];
						const d2 = distancesFromStart[`${ny},${nx}`];
						if (d1 === undefined || d2 === undefined) continue;
						if (d1 - d2 >= targetSaving + r) {
							goodCheatCount++;
						}
					}
				}
			}
		}
	}

	return goodCheatCount;
}
