enum MapObject {
	Wall = "#",
	Box = "O",
	Empty = ".",
	Robot = "@",
}

type Pos = {
	row: number;
	col: number;
};

enum Instruction {
	Up = "^",
	Right = ">",
	Down = "v",
	Left = "<",
}

const DirForInstruction = {
	[Instruction.Up]: [-1, 0],
	[Instruction.Right]: [0, 1],
	[Instruction.Down]: [1, 0],
	[Instruction.Left]: [0, -1],
} as const;

type GameStateMap = Record<number, Record<number, MapObject>>;
interface GameState {
	map: GameStateMap;
	rows: number;
	cols: number;
	currentRobotLocation: Pos;
}

function moveRobot(state: GameState, instruction: Instruction) {
	const dir = DirForInstruction[instruction];
	const toMove = [state.currentRobotLocation];
	let currentRow = state.currentRobotLocation.row + dir[0];
	let currentCol = state.currentRobotLocation.col + dir[1];
	while (true) {
		const currentObject = state.map[currentRow][currentCol];
		if (currentObject === MapObject.Wall) {
			break;
		} else if (currentObject === MapObject.Box) {
			toMove.push({
				row: currentRow,
				col: currentCol,
			});
			currentRow += dir[0];
			currentCol += dir[1];
		} else if (currentObject === MapObject.Empty) {
			for (const pos of toMove.reverse()) {
				state.map[pos.row + dir[0]][pos.col + dir[1]] = state.map[pos.row][pos.col];
			}
			state.map[state.currentRobotLocation.row][state.currentRobotLocation.col] =
				MapObject.Empty;
			state.currentRobotLocation = {
				row: state.currentRobotLocation.row + dir[0],
				col: state.currentRobotLocation.col + dir[1],
			};
			break;
		} else {
			throw new Error("Unexpected object at location");
		}
	}
}

export function solve(input: string): number {
	const lines = input.split("\n");

	const map: GameStateMap = {};
	let isParsingMap = true;
	let rows = 0;
	let cols = 0;
	let currentRow = 0;
	let robotPosition: Pos | null = null;

	const instructions: Instruction[] = [];

	for (const line of lines) {
		if (line.trim().length === 0) {
			isParsingMap = false;
		} else if (isParsingMap) {
			cols = line.length;
			rows++;
			map[currentRow] = {};
			for (let col = 0; col < line.length; col++) {
				const x = line[col] as MapObject;
				map[currentRow][col] = x;

				if (x === MapObject.Robot) {
					robotPosition = {
						row: currentRow,
						col,
					};
				}
			}
			currentRow++;
		} else {
			instructions.push(...(line.trim().split("") as Instruction[]));
		}
	}

	if (!robotPosition) throw new Error("Couldn't find robot");

	const gameState: GameState = {
		map,
		rows,
		cols,
		currentRobotLocation: robotPosition,
	};

	for (const instruction of instructions) {
		moveRobot(gameState, instruction);
		// _debugGameState(gameState);
	}

	let gpsSum = 0;

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const obj = map[row][col];
			if (obj === MapObject.Box) {
				gpsSum += row * 100 + col;
			}
		}
	}

	return gpsSum;
}

function _debugGameState({ rows, cols, map }: GameState) {
	for (let row = 0; row < rows; row++) {
		let rowStr = "";
		for (let col = 0; col < cols; col++) {
			rowStr += map[row][col];
		}
		console.log(rowStr);
	}
	console.log();
}
