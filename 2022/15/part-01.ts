import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const testExample = false;

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, `./${testExample ? "example" : "input"}.txt`));
const lines = input.split("\n");

interface Coordinate {
	x: number;
	y: number;
}

const coordsToString = (coords: Coordinate) => `${coords.x},${coords.y}`;
const stringToCoords = (coordStr: string): Coordinate => {
	const splits = coordStr.split(",");
	return {
		x: Number(splits[0]),
		y: Number(splits[1]),
	};
};

const sensorLocations: string[] = [];
const sensorToBeacon: Map<string, string> = new Map();

const TARGET_ROW = testExample ? 10 : 2000000;
const sensorOrBeaconOnTargetRow: Set<string> = new Set();

for (const line of lines) {
	const coordinateMatches = Array.from(line.matchAll(/[xy]=(-?\d+)/g));
	const sensorX = Number(coordinateMatches[0][1]);
	const sensorY = Number(coordinateMatches[1][1]);
	const beaconX = Number(coordinateMatches[2][1]);
	const beaconY = Number(coordinateMatches[3][1]);
	const sensorCoordStr = coordsToString({ x: sensorX, y: sensorY });
	const beaconCoordStr = coordsToString({ x: beaconX, y: beaconY });
	sensorLocations.push(sensorCoordStr);

	if (sensorY === TARGET_ROW) sensorOrBeaconOnTargetRow.add(sensorCoordStr);
	if (beaconY === TARGET_ROW) sensorOrBeaconOnTargetRow.add(beaconCoordStr);

	sensorToBeacon.set(sensorCoordStr, beaconCoordStr);
}

const manhattanDistBetweenCoords = (a: Coordinate, b: Coordinate): number => Math.abs(b.x - a.x) + Math.abs(b.y - a.y);

const targetRowRanges: { minX: number, maxX: number }[] = []; // max is inclusive

let sensorIdx = 0;
for (const sensorCoordStr of sensorLocations) {
	console.log(`Checking sensor ${++sensorIdx}/${sensorLocations.length}`)
	const beaconCoordStr = sensorToBeacon.get(sensorCoordStr);
	if (!beaconCoordStr) throw new Error("Couldn't find beacon for sensor");
	const sensorCoords = stringToCoords(sensorCoordStr);
	const beaconCoords = stringToCoords(beaconCoordStr);

	const beaconDistance = manhattanDistBetweenCoords(sensorCoords, beaconCoords);

	const yMin = sensorCoords.y - beaconDistance;
	const yMax = sensorCoords.y + beaconDistance;
	if (TARGET_ROW < yMin || TARGET_ROW > yMax) continue;

	const yAbsDiff = Math.abs(TARGET_ROW - sensorCoords.y);
	const maxXAbsDiff = beaconDistance - yAbsDiff;
	targetRowRanges.push({
		minX: sensorCoords.x - maxXAbsDiff,
		maxX: sensorCoords.x + maxXAbsDiff,
	});
}

const reservedXValues = Array.from(sensorOrBeaconOnTargetRow).map(stringToCoords).map(coord => coord.x);
targetRowRanges.sort((range1, range2) => range1.minX - range2.minX);
const dedupedRanges: { minX: number, maxX: number }[] = [];

for (const range of targetRowRanges) {
	if (dedupedRanges.length === 0 || range.minX > dedupedRanges[dedupedRanges.length - 1].maxX) {
		dedupedRanges.push(range);
	}
	else {
		dedupedRanges[dedupedRanges.length - 1].maxX = Math.max(range.maxX, dedupedRanges[dedupedRanges.length - 1].maxX);
	}
}

const xValuesContainedWithinRanges = reservedXValues.filter(reservedX => dedupedRanges.some(({ minX, maxX }) => reservedX >= minX && reservedX <= maxX));
const totalofRanges = dedupedRanges.reduce((total, range) => total + (range.maxX - range.minX) + 1, 0);

console.log(totalofRanges - xValuesContainedWithinRanges.length);
