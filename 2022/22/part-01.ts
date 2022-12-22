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

const mapLocations: MapLocation[] = [];
const rawMapRows = rawMap.split("\n");
for (let rowIdx = 0; rowIdx < rawMapRows.length; rowIdx++) {
	const row = rawMapRows[rowIdx];
	for (let colIdx = 0; colIdx < row.length; colIdx++) {
		const cell = row[colIdx];
		const coordinates: Coordinates = { x: colIdx, y: rowIdx };
		if (cell === ".") {
			mapLocations.push({ coordinates, type: "empty" });
		} else if (cell === "#") {
			mapLocations.push({ coordinates, type: "wall" });
		} else {
			// nothing
			continue;
		}
	}
}

const START_COORDINATES = mapLocations[0].coordinates;

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

function moveForward(coordinates: Coordinates, direction: FacingDirection) {
	const diffX = diffXGivenDirection(direction);
	const diffY = diffYGivenDirection(direction);

	const locationsInDirection = (direction === FacingDirection.Right || direction === FacingDirection.Left)
		?  mapLocations.filter(loc => loc.coordinates.y === coordinates.y).sort((a, b) => a.coordinates.x - b.coordinates.x)
		: mapLocations.filter(loc => loc.coordinates.x === coordinates.x).sort((a, b) => a.coordinates.y - b.coordinates.y);

	let nextLocation = locationsInDirection.find(loc => loc.coordinates.x === coordinates.x + diffX && loc.coordinates.y === coordinates.y + diffY);
	if (!nextLocation) {
		if (direction === FacingDirection.Right || direction === FacingDirection.Down) {
			nextLocation = locationsInDirection[0];
		} else {
			nextLocation = locationsInDirection[locationsInDirection.length - 1];
		}
	}

	if (nextLocation.type === "wall") return null
	else return nextLocation.coordinates;
}

for (const instruction of instructions) {
	if (typeof instruction === "number") {
		let toMove = instruction;
		const path = [currentState.coordinates];
		while (toMove > 0) {
			const nextCoordinates = moveForward(currentState.coordinates, currentState.facing);
			if (nextCoordinates === null) break;
			currentState.coordinates = nextCoordinates;
			path.push(nextCoordinates);
			toMove--;
		}
	} else {
		currentState.facing = turn(currentState.facing, instruction);
	}
}

console.log(1000 * (currentState.coordinates.y + 1) + 4 * (currentState.coordinates.x + 1) + currentState.facing);
