import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

import { assertIsDefined } from '../utils.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const [rawMap, rawInstructions] = input.split("\n\n");

interface Coordinates {
	x: number;
	y: number;
}

interface MapLocation {
	coordinates: Coordinates;
	type: "empty" | "wall";
	face: number;
	coordinatesOnFace: Coordinates;
}

enum TurnDirection {
	Left = "L",
	Right = "R",
}

enum FacingDirection {
	Right,
	Down,
	Left,
	Up,
}

// Note: this is specific to my input
const CUBE_FACES = [
	[null, 1, 2],
	[null, 3, null],
	[4, 5, null],
	[6, null, null],
];
const EDGE_LENGTH = 50;

const mapLocations: MapLocation[] = [];
const rawMapRows = rawMap.split("\n");
for (let rowIdx = 0; rowIdx < rawMapRows.length; rowIdx++) {
	const row = rawMapRows[rowIdx];
	for (let colIdx = 0; colIdx < row.length; colIdx++) {
		const faceRowIdx = Math.floor(rowIdx / EDGE_LENGTH);
		const faceColIdx = Math.floor(colIdx / EDGE_LENGTH);
		const face = CUBE_FACES[faceRowIdx][faceColIdx];

		const cell = row[colIdx];
		const coordinates: Coordinates = { x: colIdx, y: rowIdx };
		const coordinatesOnFace: Coordinates = { x: colIdx % EDGE_LENGTH, y: rowIdx % EDGE_LENGTH };
		if (cell === ".") {
			assertIsDefined(face);
			mapLocations.push({ coordinates, type: "empty", face, coordinatesOnFace });
		} else if (cell === "#") {
			assertIsDefined(face);
			mapLocations.push({ coordinates, type: "wall", face, coordinatesOnFace });
		} else {
			// nothing
			continue;
		}
	}
}

const START_COORDINATES = mapLocations[0].coordinates;
const START_FACE = mapLocations[0].face;

const instructions: (number | TurnDirection)[] = [];
const rawInstructionsSplit = rawInstructions.match(/(\d+|\w)/g);
assertIsDefined(rawInstructionsSplit);
for (const rawInstruction of rawInstructionsSplit) {
	if (rawInstruction === "R") instructions.push(TurnDirection.Right);
	else if (rawInstruction === "L") instructions.push(TurnDirection.Left);
	else instructions.push(Number(rawInstruction));
}

const currentState = {
	facing: FacingDirection.Right,
	coordinates: START_COORDINATES,
	face: START_FACE,
};

function turn(facing: FacingDirection, direction: TurnDirection) {
	switch (facing) {
		case FacingDirection.Up:
			return direction === TurnDirection.Right ? FacingDirection.Right : FacingDirection.Left;
		case FacingDirection.Right:
			return direction === TurnDirection.Right ? FacingDirection.Down : FacingDirection.Up;
		case FacingDirection.Down:
			return direction === TurnDirection.Right ? FacingDirection.Left : FacingDirection.Right;
		case FacingDirection.Left:
			return direction === TurnDirection.Right ? FacingDirection.Up : FacingDirection.Down;
	}
}

const diffXGivenDirection = (dir: FacingDirection) =>
	dir === FacingDirection.Right ? 1
	: dir === FacingDirection.Left ? -1
	: 0;
const diffYGivenDirection = (dir: FacingDirection) =>
	dir === FacingDirection.Down ? 1
	: dir === FacingDirection.Up ? -1
	: 0;

const FaceToFaceMap: Record<number, Partial<Record<FacingDirection, { face: number, facing: FacingDirection, flip?: boolean }>>> = {
	1: {
		[FacingDirection.Up]: { face: 6, facing: FacingDirection.Right },
		[FacingDirection.Left]: { face: 4, facing: FacingDirection.Right, flip: true },
	},
	2: {
		[FacingDirection.Up]: { face: 6, facing: FacingDirection.Up },
		[FacingDirection.Right]: { face: 5, facing: FacingDirection.Left, flip: true },
		[FacingDirection.Down]: { face: 3, facing: FacingDirection.Left },
	},
	3: {
		[FacingDirection.Left]: { face: 4, facing: FacingDirection.Down },
		[FacingDirection.Right]: { face: 2, facing: FacingDirection.Up },
	},
	4: {
		[FacingDirection.Up]: { face: 3, facing: FacingDirection.Right },
		[FacingDirection.Left]: { face: 1, facing: FacingDirection.Right, flip: true },
	},
	5: {
		[FacingDirection.Right]: { face: 2, facing: FacingDirection.Left, flip: true },
		[FacingDirection.Down]: { face: 6, facing: FacingDirection.Left },
	},
	6: {
		[FacingDirection.Left]: { face: 1, facing: FacingDirection.Down },
		[FacingDirection.Down]: { face: 2, facing: FacingDirection.Down },
		[FacingDirection.Right]: { face: 5, facing: FacingDirection.Up },
	}
};

function moveForward(face: number, coordinates: Coordinates, direction: FacingDirection) {
	const diffX = diffXGivenDirection(direction);
	const diffY = diffYGivenDirection(direction);

	let nextLocation = mapLocations.find(loc => loc.coordinates.x === coordinates.x + diffX && loc.coordinates.y === coordinates.y + diffY);
	let nextFacing = direction;
	if (!nextLocation) {
		const nextFaceInfo = FaceToFaceMap[face][direction];
		assertIsDefined(nextFaceInfo);
		nextFacing = nextFaceInfo.facing;

		nextLocation = mapLocations.find(loc => {
			if (loc.face !== nextFaceInfo.face) return false;

			let distanceFromCorner: number | null;
			switch (direction) {
				case FacingDirection.Up:
				case FacingDirection.Down:
					distanceFromCorner = coordinates.x % EDGE_LENGTH;
					break;
				case FacingDirection.Left:
				case FacingDirection.Right:
					distanceFromCorner = coordinates.y % EDGE_LENGTH;
					break;
			}

			let targetX: number | null;
			let targetY: number | null;
			switch (nextFaceInfo.facing) {
				case FacingDirection.Down:
					targetY = 0;
					targetX = nextFaceInfo.flip ? EDGE_LENGTH - 1 - distanceFromCorner : distanceFromCorner;
					break;
				case FacingDirection.Up:
					targetY = EDGE_LENGTH - 1;
					targetX = nextFaceInfo.flip ? EDGE_LENGTH - 1 - distanceFromCorner : distanceFromCorner;
					break;
				case FacingDirection.Right:
					targetX = 0;
					targetY = nextFaceInfo.flip ? EDGE_LENGTH - 1 - distanceFromCorner : distanceFromCorner;
					break;
				case FacingDirection.Left:
					targetX = EDGE_LENGTH - 1;
					targetY = nextFaceInfo.flip ? EDGE_LENGTH - 1 - distanceFromCorner : distanceFromCorner;
					break;
			}

			return loc.coordinatesOnFace.x === targetX && loc.coordinatesOnFace.y === targetY;
		});
	}

	assertIsDefined(nextLocation);

	if (nextLocation.type === "wall") return null
	else return { ...nextLocation, facing: nextFacing };
}

for (const instruction of instructions) {
	if (typeof instruction === "number") {
		let toMove = instruction;
		while (toMove > 0) {
			const next = moveForward(currentState.face, currentState.coordinates, currentState.facing);
			if (next === null) break;
			currentState.coordinates = next.coordinates;
			currentState.face = next.face;
			currentState.facing = next.facing;
			toMove--;
		}
	} else {
		currentState.facing = turn(currentState.facing, instruction);
	}
}

console.log(1000 * (currentState.coordinates.y + 1) + 4 * (currentState.coordinates.x + 1) + currentState.facing);
