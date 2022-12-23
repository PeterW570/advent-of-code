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

const elves: Coordinates[] = [];

for (let rowIdx = 0; rowIdx < lines.length; rowIdx++) {
	const line = lines[rowIdx];
	for (let colIdx = 0; colIdx < line.length; colIdx++) {
		const cell = line[colIdx];
		if (cell === "#") {
			elves.push({ x: colIdx, y: rowIdx });
		}
	}
}

const directionPriorities = [
	Direction.North,
	Direction.South,
	Direction.West,
	Direction.East,
];

const ROUNDS = 10;

function hasElvesInDirection(elf: Coordinates, direction: Direction) {
	switch (direction) {
		case Direction.North:
			return elves.some(loc => loc.x >= elf.x - 1 && loc.x <= elf.x + 1 && loc.y === elf.y - 1);
		case Direction.South:
			return elves.some(loc => loc.x >= elf.x - 1 && loc.x <= elf.x + 1 && loc.y === elf.y + 1);
		case Direction.East:
			return elves.some(loc => loc.y >= elf.y - 1 && loc.y <= elf.y + 1 && loc.x === elf.x + 1);
		case Direction.West:
			return elves.some(loc => loc.y >= elf.y - 1 && loc.y <= elf.y + 1 && loc.x === elf.x - 1);
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

const isSamePosition = (a: Coordinates, b: Coordinates) => a.x === b.x && a.y === b.y;

function findBoundingBox() {
	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;
	for (const elf of elves) {
		minX = Math.min(minX, elf.x);
		maxX = Math.max(maxX, elf.x);
		minY = Math.min(minY, elf.y);
		maxY = Math.max(maxY, elf.y);
	}
	return { minX, maxX, minY, maxY };
}

function _printState() {
	const { minX, maxX, minY, maxY } = findBoundingBox();

	for (let row = 0; row <= maxY - minY ; row++) {
		let rowToPrint = "";
		for (let col = 0; col <= maxX - minX; col++) {
			const elfAtPosition = elves.some(loc => loc.x === minX + col && loc.y === minY + row);
			rowToPrint += elfAtPosition ? "#" : ".";
		}
		console.log(rowToPrint);
	}
	console.log("\n");
}

// _printState();
for (let round = 0; round < ROUNDS; round++) {
	const potentialElfPositions: { elfIdx: number, nextCoordinates: Coordinates }[] = [];
	for (let elfIdx = 0; elfIdx < elves.length; elfIdx++) {
		const elf = elves[elfIdx];
		
		const elvesInDirection = directionPriorities.map(dir => hasElvesInDirection(elf, dir));
		if (elvesInDirection.every(x => x === false)) continue;
		
		const toMoveIdx = elvesInDirection.findIndex(x => x === false);
		if (toMoveIdx > -1) {
			const directionToMove = directionPriorities[toMoveIdx];
			potentialElfPositions.push({ elfIdx, nextCoordinates: moveInDirection(elf, directionToMove) });
		}
	}
	for (const potential of potentialElfPositions) {
		if (potentialElfPositions.some(p => p.elfIdx !== potential.elfIdx && isSamePosition(p.nextCoordinates, potential.nextCoordinates))) continue;
		else elves[potential.elfIdx] = potential.nextCoordinates;
	}
	const firstDir = directionPriorities.shift();
	assertIsDefined(firstDir);
	directionPriorities.push(firstDir);
	// _printState();
}

const { minX, maxX, minY, maxY } = findBoundingBox();
const emptySpaces = (maxX - minX + 1) * (maxY - minY + 1) - elves.length;
console.log(emptySpaces);
