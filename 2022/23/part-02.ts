import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

import { assertIsDefined } from '../utils.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

interface Coordinates {
	x: number;
	y: number;
}

enum Direction {
	North,
	East,
	South,
	West,
}

const coordsToString = (coords: Coordinates) => `${coords.x},${coords.y}`;
const stringToCoords = (str: string): Coordinates => {
	const [xStr, yStr] = str.split(",");
	return { x: Number(xStr), y: Number(yStr) };
};

const elves: Set<string> = new Set();

for (let rowIdx = 0; rowIdx < lines.length; rowIdx++) {
	const line = lines[rowIdx];
	for (let colIdx = 0; colIdx < line.length; colIdx++) {
		const cell = line[colIdx];
		if (cell === "#") {
			elves.add(coordsToString({ x: colIdx, y: rowIdx }));
		}
	}
}

const directionPriorities = [
	Direction.North,
	Direction.South,
	Direction.West,
	Direction.East,
];

function hasElvesInDirection(elf: Coordinates, direction: Direction) {
	switch (direction) {
		case Direction.North:
			return elves.has(coordsToString({ x: elf.x - 1, y: elf.y - 1}))
				|| elves.has(coordsToString({ x: elf.x, y: elf.y - 1}))
				|| elves.has(coordsToString({ x: elf.x + 1, y: elf.y - 1}));
		case Direction.South:
			return elves.has(coordsToString({ x: elf.x - 1, y: elf.y + 1}))
				|| elves.has(coordsToString({ x: elf.x, y: elf.y + 1}))
				|| elves.has(coordsToString({ x: elf.x + 1, y: elf.y + 1}))
		case Direction.East:
			return elves.has(coordsToString({ x: elf.x + 1, y: elf.y - 1}))
				|| elves.has(coordsToString({ x: elf.x + 1, y: elf.y}))
				|| elves.has(coordsToString({ x: elf.x + 1, y: elf.y + 1}));
		case Direction.West:
			return elves.has(coordsToString({ x: elf.x - 1, y: elf.y - 1}))
				|| elves.has(coordsToString({ x: elf.x - 1, y: elf.y}))
				|| elves.has(coordsToString({ x: elf.x - 1, y: elf.y + 1}));
	}
}

function moveInDirection(elf: Coordinates, direction: Direction): Coordinates {
	switch (direction) {
		case Direction.North:
			return { x: elf.x, y: elf.y - 1 };
		case Direction.South:
			return { x: elf.x, y: elf.y + 1 };
		case Direction.East:
			return { x: elf.x + 1, y: elf.y };
		case Direction.West:
			return { x: elf.x - 1, y: elf.y };
	}
}

let roundNum = 0;
while (true) {
	roundNum++;
	if (roundNum % 100 === 0) console.log(roundNum);
	const potentialElfPositions: Map<string, number[]> = new Map();
	const elvesArr = Array.from(elves);
	for (let elfIdx = 0; elfIdx < elvesArr.length; elfIdx++) {
		const elf = stringToCoords(elvesArr[elfIdx]);
		
		const elvesInDirection = directionPriorities.map(dir => hasElvesInDirection(elf, dir));
		if (elvesInDirection.every(x => x === false)) continue;
		
		const toMoveIdx = elvesInDirection.findIndex(x => x === false);
		if (toMoveIdx > -1) {
			const directionToMove = directionPriorities[toMoveIdx];
			const nextCoords = coordsToString(moveInDirection(elf, directionToMove));
			const existing = potentialElfPositions.get(nextCoords);
			potentialElfPositions.set(nextCoords, (existing || []).concat([elfIdx]));
		}
	}
	if (!potentialElfPositions.size) break;
	for (const [coordStr, elfIndices] of Array.from(potentialElfPositions)) {
		if (elfIndices.length !== 1) continue;
		else elvesArr[elfIndices[0]] = coordStr;
	}
	elves.clear();
	elvesArr.forEach(str => elves.add(str));
	const firstDir = directionPriorities.shift();
	assertIsDefined(firstDir);
	directionPriorities.push(firstDir);
}

console.log("Solution: ", roundNum);
