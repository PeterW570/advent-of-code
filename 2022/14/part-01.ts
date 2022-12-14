import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

interface Coordinates {
	x: number;
	y: number;
}

const strToNumCoords = (str: string): Coordinates => {
	const parsed = str.split(",").map(s => Number(s));
	if (parsed.length !== 2) throw new Error("Unable to parse coordinates");
	return { x: parsed[0], y: parsed[1] };
};
const numToStrCoords = (coords: Coordinates): string => `${coords.x},${coords.y}`;

const rocks = new Set();
let lowestRockRow = -Infinity;
for (const line of lines) {
	const strLineVertices = line.split(" -> ");
	const lineVertices = strLineVertices.map(strToNumCoords);

	let { x, y } = lineVertices[0];
	const verticesCount = lineVertices.length;

	let targetIdx = 1;
	let reachedEnd = false;
	while (!reachedEnd) {
		rocks.add(numToStrCoords({ x, y }));
		lowestRockRow = Math.max(lowestRockRow, y);
		const { x: tx, y: ty } = lineVertices[targetIdx];
		if (x === tx && y === ty) {
			if (targetIdx == verticesCount - 1) {
				reachedEnd = true;
			} else {
				targetIdx++;
			}
		} else if (x == tx) {
			y += ((y < ty) ? 1 : -1);
		} else {
			x += ((x < tx) ? 1 : -1);
		}
	}
}

const SNOW_SOURCE: Coordinates = {
	x: 500,
	y: 0
}
const FLOOR_LEVEL = lowestRockRow + 2;
const snowAtRest = new Set();

const canMoveDown = ({ x, y }: Coordinates) => {
	const next = numToStrCoords({ x, y: y + 1 });
	return !snowAtRest.has(next) && !rocks.has(next) && ((y + 1) < FLOOR_LEVEL);
};
const canMoveDownLeft = ({ x, y }: Coordinates) => {
	const next = numToStrCoords({ x: x - 1, y: y + 1 });
	return !snowAtRest.has(next) && !rocks.has(next) && ((y + 1) < FLOOR_LEVEL);
};
const canMoveDownRight = ({ x, y }: Coordinates) => {
	const next = numToStrCoords({ x: x + 1, y: y + 1 });
	return !snowAtRest.has(next) && !rocks.has(next) && ((y + 1) < FLOOR_LEVEL);
};
function moveSnow(coords: Coordinates) {
	if (canMoveDown(coords)) {
		return { x: coords.x, y: coords.y + 1 };
	} else if (canMoveDownLeft(coords)) {
		return { x: coords.x - 1, y: coords.y + 1 };
	} else if (canMoveDownRight(coords)) {
		return { x: coords.x + 1, y: coords.y + 1 };
	} else {
		return coords;
	}
}

function dropSnow() {
	let { x, y } = SNOW_SOURCE;
	while (y <= lowestRockRow) {
		const { x: newX, y: newY } = moveSnow({ x, y });
		if (newX == x && newY == y) {
			break;
		} else {
			x = newX;
			y = newY;
		}
	}
	return y > lowestRockRow ? null : {x, y};
}

while (true) {
	const snowFall = dropSnow();
	if (snowFall) snowAtRest.add(numToStrCoords(snowFall));
	else break;
}

console.log(snowAtRest.size);
