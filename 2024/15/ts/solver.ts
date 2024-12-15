enum InputMapObject {
	Wall = "#",
	Box = "O",
	Empty = ".",
	Robot = "@",
}

enum MapObject {
	Wall = "#",
	BoxLeft = "[",
	BoxRight = "]",
	Empty = ".",
	Robot = "@",
}

function inputObjectToMapObject(inputObject: InputMapObject): [MapObject, MapObject] {
	if (inputObject === InputMapObject.Wall) return [MapObject.Wall, MapObject.Wall];
	else if (inputObject === InputMapObject.Box) return [MapObject.BoxLeft, MapObject.BoxRight];
	else if (inputObject === InputMapObject.Empty) return [MapObject.Empty, MapObject.Empty];
	else if (inputObject === InputMapObject.Robot) return [MapObject.Robot, MapObject.Empty];
	else throw new Error("Unexpected input object");
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
	let positionsToCheck = new Set<string>();
	positionsToCheck.add(
		`${state.currentRobotLocation.row + dir[0]},${state.currentRobotLocation.col + dir[1]}`
	);
	loop: while (true) {
		const nextPositionsToCheck = new Set<string>();
		let allEmpty = true;
		for (const currentPos of positionsToCheck) {
			const [currentRowStr, currentColStr] = currentPos.split(",");
			const currentRow = parseInt(currentRowStr);
			const currentCol = parseInt(currentColStr);
			const currentObject = state.map[currentRow][currentCol];

			if (currentObject === MapObject.Wall) {
				break loop;
			} else if (currentObject === MapObject.BoxLeft) {
				toMove.unshift({
					row: currentRow,
					col: currentCol,
				});
				nextPositionsToCheck.add(`${currentRow + dir[0]},${currentCol + dir[1]}`);
				if (dir[1] === 0) {
					toMove.unshift({
						row: currentRow,
						col: currentCol + 1,
					});
					nextPositionsToCheck.add(`${currentRow + dir[0]},${currentCol + 1}`);
				}
				allEmpty = false;
			} else if (currentObject === MapObject.BoxRight) {
				toMove.unshift({
					row: currentRow,
					col: currentCol,
				});
				nextPositionsToCheck.add(`${currentRow + dir[0]},${currentCol + dir[1]}`);
				if (dir[1] === 0) {
					toMove.unshift({
						row: currentRow,
						col: currentCol - 1,
					});
					nextPositionsToCheck.add(`${currentRow + dir[0]},${currentCol - 1}`);
				}
				allEmpty = false;
			} else if (currentObject === MapObject.Empty) {
				nextPositionsToCheck.add(`${currentRow},${currentCol}`);
			} else {
				throw new Error("Unexpected object at location: " + currentObject);
			}
		}

		if (allEmpty) {
			const moved = new Set<string>();
			for (const pos of toMove) {
				const strPos = `${pos.row},${pos.col}`;
				if (moved.has(strPos)) continue;

				const movingObject = state.map[pos.row][pos.col];
				state.map[pos.row + dir[0]][pos.col + dir[1]] = movingObject;
				state.map[pos.row][pos.col] = MapObject.Empty;

				moved.add(strPos);
			}
			state.currentRobotLocation = {
				row: state.currentRobotLocation.row + dir[0],
				col: state.currentRobotLocation.col + dir[1],
			};
			break;
		} else {
			positionsToCheck = nextPositionsToCheck;
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
				const x = line[col] as InputMapObject;
				const newMapObjects = inputObjectToMapObject(x);
				for (let i = 0; i < newMapObjects.length; i++) {
					const obj = newMapObjects[i];
					map[currentRow][col * 2 + i] = obj;
				}

				if (x === InputMapObject.Robot) {
					robotPosition = {
						row: currentRow,
						col: col * 2,
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
		cols: cols * 2,
		currentRobotLocation: robotPosition,
	};

	// _debugGameState(gameState);

	for (const instruction of instructions) {
		moveRobot(gameState, instruction);
		// _debugGameState(gameState);
	}

	let gpsSum = 0;

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols * 2; col++) {
			const obj = map[row][col];
			if (obj === MapObject.BoxLeft) {
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
	console.log("");
}
