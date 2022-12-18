import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./example.txt"));

const lines = input.split("\n");

interface Coordinates {
	x: number;
	y: number;
	z: number;
}

const parsed: Coordinates[] = lines.map(str => {
	const matches = str.match(/(?<x>\d+),(?<y>\d+),(?<z>\d+)/);
	if (!matches?.groups) throw new Error("Couldnt parse input");
	return {
		x: Number(matches.groups.x),
		y: Number(matches.groups.y),
		z: Number(matches.groups.z),
	};
});

let totalSurfaceArea = 0;

const cubesAreConnected = (a: Coordinates, b: Coordinates) => (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) === 1;
const coordToString = (coord: Coordinates) => `${coord.x},${coord.y},${coord.z}`;

const connectedMap: Map<Coordinates, number> = new Map();

for (let i = 0; i < parsed.length; i++) {
	const cubeA = parsed[i];

	let connected = connectedMap.get(cubeA) ?? 0;
	if (i < parsed.length) for (let j = i + 1; j < parsed.length; j++) {
		const cubeB = parsed[j];
		if (cubesAreConnected(cubeA, cubeB)) {
			connected++;
			connectedMap.set(cubeA, connected);
			connectedMap.set(cubeB, (connectedMap.get(cubeB) ?? 0) + 1);
		}
	}

	totalSurfaceArea += (6 - connected);
}

// console.log(totalSurfaceArea);

const cubes = new Set(lines);
const checked: Set<string> = new Set();
const getOffsetCoords = (coords: Coordinates, xOffset: number, yOffset: number, zOffset: number): Coordinates => ({
	x: coords.x + xOffset,
	y: coords.y + yOffset,
	z: coords.z + zOffset,
});

for (let i = 0; i < parsed.length; i++) {
	const cubeA = parsed[i];
	const adjacent = [
		getOffsetCoords(cubeA, 1, 0, 0),
		getOffsetCoords(cubeA, -1, 0, 0),
		getOffsetCoords(cubeA, 0, 1, 0),
		getOffsetCoords(cubeA, 0, -1, 0),
		getOffsetCoords(cubeA, 0, 0, 1),
		getOffsetCoords(cubeA, 0, 0, -1),
	];

	for (const toCheck of adjacent) {
		const toCheckStr = coordToString(toCheck);
		if (checked.has(toCheckStr)) continue;
		else if (cubes.has(toCheckStr)) continue;

		let adjacentCubes = 1;
		for (let j = 0; j < parsed.length; j++) {
			if (i == j) continue;
			const cubeB = parsed[j];
			if (cubesAreConnected(toCheck, cubeB)) adjacentCubes++;

			if (adjacentCubes === 6) {
				totalSurfaceArea -= 6;
				break;
			}
		}

		checked.add(toCheckStr);
	}
}

console.log(totalSurfaceArea);
