import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));

const lines = input.split("\n");

interface Coordinates {
	x: number;
	y: number;
	z: number;
}

const coordToString = (coord: Coordinates) => `${coord.x},${coord.y},${coord.z}`;
const stringToCoors = (str: string): Coordinates => {
	const matches = str.match(/(?<x>\d+),(?<y>\d+),(?<z>\d+)/);
	if (!matches?.groups) throw new Error("Couldnt parse input");
	return {
		x: Number(matches.groups.x),
		y: Number(matches.groups.y),
		z: Number(matches.groups.z),
	};
};

let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;
let minZ = Infinity;
let maxZ = -Infinity;

for (const line of lines) {
	const coords = stringToCoors(line);
	minX = Math.min(minX, coords.x);
	maxX = Math.max(maxX, coords.x);
	minY = Math.min(minY, coords.y);
	maxY = Math.max(maxY, coords.y);
	minZ = Math.min(minZ, coords.z);
	maxZ = Math.max(maxZ, coords.z);
}

let totalSurfaceArea = 0;

const cubes = new Set(lines);
const checked: Set<string> = new Set();
const getOffsetCoords = (coords: Coordinates, xOffset: number, yOffset: number, zOffset: number): Coordinates => ({
	x: coords.x + xOffset,
	y: coords.y + yOffset,
	z: coords.z + zOffset,
});

const cubeWithinCheckingVolume = (coords: Coordinates) => {
	if (coords.x < minX - 1) return false;
	else if (coords.x > maxX + 1) return false;
	else if (coords.y < minY - 1) return false;
	else if (coords.y > maxY + 1) return false;
	else if (coords.z < minZ - 1) return false;
	else if (coords.z > maxZ + 1) return false;
	return true;
}

const queue: Coordinates[] = [{
	x: minX - 1,
	y: minY - 1,
	z: minZ - 1,
}];

while (true) {
	const currentLocation = queue.shift();
	if (!currentLocation) break;

	const currentLocationStr = coordToString(currentLocation);
	if (checked.has(currentLocationStr)) continue;
	else if (cubes.has(currentLocationStr)) continue;

	const adjacent = [
		getOffsetCoords(currentLocation, 1, 0, 0),
		getOffsetCoords(currentLocation, -1, 0, 0),
		getOffsetCoords(currentLocation, 0, 1, 0),
		getOffsetCoords(currentLocation, 0, -1, 0),
		getOffsetCoords(currentLocation, 0, 0, 1),
		getOffsetCoords(currentLocation, 0, 0, -1),
	];

	for (const cube of adjacent) {
		if (!cubeWithinCheckingVolume(cube)) continue;
		else if (checked.has(currentLocationStr)) continue;
		else if (cubes.has(coordToString(cube))) totalSurfaceArea++;
		else queue.push(cube);
	}

	checked.add(currentLocationStr);
}

console.log(totalSurfaceArea);
