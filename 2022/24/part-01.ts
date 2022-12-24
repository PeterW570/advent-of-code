import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

import { assertIsDefined } from '../utils.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

const HEIGHT = lines.length;
const WIDTH = lines[0].length;

interface Coordinates {
	x: number;
	y: number;
}

enum Direction {
	Up = "^",
	Down = "v",
	Left = "<",
	Right = ">"
}

interface BlizzardInfo {
	coordinates: Coordinates;
	direction: Direction;
}

const coordinatesToString = (coords: Coordinates) => `${coords.x},${coords.y}`;

let startPoint: Coordinates | null = null;
let endPoint: Coordinates | null = null;

const wallLocations: Set<string> = new Set();
const blizzards: BlizzardInfo[] = [];
for (let rowIdx = 0; rowIdx < lines.length; rowIdx++) {
	const row = lines[rowIdx];
	for (let colIdx = 0; colIdx < row.length; colIdx++) {
		const cell = row[colIdx];
		const coords = { x: colIdx, y: rowIdx };
		switch (cell) {
			case "#":
				wallLocations.add(coordinatesToString(coords));
				break;
			case ">":
				blizzards.push({ coordinates: coords, direction: Direction.Right });
				break;
			case "<":
				blizzards.push({ coordinates: coords, direction: Direction.Left });
				break;
			case "^":
				blizzards.push({ coordinates: coords, direction: Direction.Up });
				break;
			case "v":
				blizzards.push({ coordinates: coords, direction: Direction.Down });
				break;
			default:
				if (rowIdx === 0) {
					startPoint = coords;
				} else if (rowIdx === lines.length - 1) {
					endPoint = coords;
				}
				break;
		}
	}
}

assertIsDefined(startPoint);
assertIsDefined(endPoint);

function moveBlizzard({ coordinates, direction }: BlizzardInfo) {
	let nextCoordinates: Coordinates | null = null;
	const WALL_WIDTH = 1;
	const innerHeight = HEIGHT - 2 * WALL_WIDTH;
	const innerWidth = WIDTH - 2 * WALL_WIDTH;
	const innerX = coordinates.x - WALL_WIDTH;
	const innerY = coordinates.y - WALL_WIDTH;
	switch (direction) {
		case Direction.Up:
			nextCoordinates = { x: coordinates.x, y: (innerY - 1 + innerHeight) % innerHeight + WALL_WIDTH };
			break;
		case Direction.Down:
			nextCoordinates = { x: coordinates.x, y: (innerY + 1) % innerHeight + WALL_WIDTH };
			break;
		case Direction.Left:
			nextCoordinates = { x: (innerX - 1 + innerWidth) % innerWidth + WALL_WIDTH, y: coordinates.y };
			break;
		case Direction.Right:
			nextCoordinates = { x: (innerX + 1) % innerWidth + WALL_WIDTH, y: coordinates.y };
			break;
	}
	return nextCoordinates;
}

const endPointStr = coordinatesToString(endPoint);
const endX = endPoint.x;
const endY = endPoint.y;

const blizzardLocations: Set<string> = new Set();

function possibleLocations(coords: Coordinates) {
	const toCheck: Coordinates[] = [
		coords,
		{ x: coords.x, y: coords.y + 1 },
		{ x: coords.x, y: coords.y - 1 },
		{ x: coords.x - 1, y: coords.y },
		{ x: coords.x + 1, y: coords.y },
	];
	return toCheck.filter(loc => {
		if (loc.y < 0) return false;
		const strCoords = coordinatesToString(loc);
		return !wallLocations.has(strCoords) && !blizzardLocations.has(strCoords);
	});
}

// function printBlizzardState(state: BlizzardInfo[]) {
// 	for (let rowIdx = 0; rowIdx < HEIGHT; rowIdx++) {
// 		let rowToPrint = "";
// 		for (let colIdx = 0; colIdx < WIDTH; colIdx++) {
// 			const blizzards = state.filter(info => info.coordinates.x === colIdx && info.coordinates.y === rowIdx);
// 			if (blizzards.length === 0) {
// 				rowToPrint += ".";
// 			} else if (blizzards.length === 1) {
// 				rowToPrint += blizzards[0].direction;
// 			} else {
// 				rowToPrint += blizzards.length;
// 			}
// 		}
// 		console.log(rowToPrint);
// 	}
// 	console.log("\n");
// }

// const blizzardState = [
// 	JSON.stringify(blizzards),
// ];

let minutes = 0;
let queue = [startPoint]
solver: while (queue.length) {
	minutes++;
	// console.log(minutes);
	blizzardLocations.clear();
	// const blizzardStateForMinute: BlizzardInfo[] = [];
	for (let blizzardIdx = 0; blizzardIdx < blizzards.length; blizzardIdx++) {
		const info = blizzards[blizzardIdx];
		const nextCoords = moveBlizzard(info);
		blizzards[blizzardIdx].coordinates = nextCoords;
		blizzardLocations.add(coordinatesToString(nextCoords));
		// blizzardStateForMinute.push(info);
	}
	// blizzardState.push(JSON.stringify(blizzardStateForMinute));

	const nextQueue: Coordinates[] = [];
	const seenCoords: Set<string> = new Set();
	for (const coords of queue) {
		const next = possibleLocations(coords);
		if (next.some(loc => coordinatesToString(loc) === endPointStr)) {
			// for (let min = 0; min < blizzardState.length; min++) {
			// 	console.log(`Minute: ${min}`)
			// 	printBlizzardState(JSON.parse(blizzardState[min]));
			// }
			break solver;
		}
		for (const coords of next) {
			const coordStr = coordinatesToString(coords);
			if (seenCoords.has(coordStr)) continue;
			seenCoords.add(coordStr);
			nextQueue.push(coords);
		}
	}
	queue = nextQueue.map(coords => ({ coords, distToEnd: endX - coords.x + endY - coords.y }))
		.sort((a, b) => b.distToEnd > a.distToEnd ? -1 : 1)
		.slice(0, 100)
		.map(({ coords }) => coords);
}

console.log(minutes);
