import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const useInput = true;

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, `./${useInput ? "input" : "example"}.txt`));
const lines = input.split("\n");

interface Coordinate {
	x: number;
	y: number;
}

interface SensorInfo {
	sensorCoords: Coordinate;
	beaconDistance: number;
	xMin: number;
	xMax: number;
	yMin: number;
	yMax: number;
}

const sensorInfo: SensorInfo[] = [];

const MAX_COORD_VAL = useInput ? 4000000 : 20;
const manhattanDistBetweenCoords = (a: Coordinate, b: Coordinate): number => Math.abs(b.x - a.x) + Math.abs(b.y - a.y);

for (const line of lines) {
	const coordinateMatches = Array.from(line.matchAll(/[xy]=(-?\d+)/g));
	const sensorX = Number(coordinateMatches[0][1]);
	const sensorY = Number(coordinateMatches[1][1]);
	const beaconX = Number(coordinateMatches[2][1]);
	const beaconY = Number(coordinateMatches[3][1]);
	const sensorCoords = { x: sensorX, y: sensorY };
	const beaconCoords = { x: beaconX, y: beaconY };
	const beaconDistance = manhattanDistBetweenCoords(sensorCoords, beaconCoords);
	sensorInfo.push({
		sensorCoords,
		beaconDistance,
		xMin: sensorX - beaconDistance,
		xMax: sensorX + beaconDistance,
		yMin: sensorY - beaconDistance,
		yMax: sensorY + beaconDistance,
	});
}


function findDistressBeacon(): Coordinate {
	let x = 0;
	while (x <= MAX_COORD_VAL) {
		let y = 0;
		while (y <= MAX_COORD_VAL) {
			console.log(x, y);
			const coords = { x, y };

			for (const info of sensorInfo) {
				if (coords.y < info.yMin || coords.y > info.yMax || coords.x < info.xMin || coords.x > info.xMax) continue;
				const dist = manhattanDistBetweenCoords(info.sensorCoords, coords);
				if (dist > info.beaconDistance) continue;
				
				const xAbsDiff = Math.abs(x - info.sensorCoords.x);
				const maxYAbsDiff = info.beaconDistance - xAbsDiff;
				y = info.sensorCoords.y + maxYAbsDiff + 1;
				break;
			}
			if (y === coords.y) return coords;
		}
		x++;
	}
	throw new Error("Couldn't find coordinates");
}

const distressBeacon = findDistressBeacon();
console.log(distressBeacon.x * 4000000 + distressBeacon.y);
