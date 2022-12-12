import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

/* -------------------------------------------------------------------------- */
/*                              Initialise things                             */
/* -------------------------------------------------------------------------- */

let startCoords: [number, number] | null = null;
let endCoords: [number, number] | null = null;
const nodes: number[][] = [];

const START_ELEVATION = 0;
const END_ELEVATION = "z".charCodeAt(0) - "a".charCodeAt(0);

const getNodeKey = (coord: [number, number]) => coord.join(",");

const distancesFromStart: number[][] = [];
const unvisitedNodes: Set<string> = new Set();
const previousNodeLookup: Partial<Record<string, string>> = {};

/* -------------------------------------------------------------------------- */
/*                                 Parse Input                                */
/* -------------------------------------------------------------------------- */

for (let rowIdx = 0; rowIdx < lines.length; rowIdx++) {
	const line = lines[rowIdx];
	const parsedLine: number[] = [];
	const initialDistances = [];

	for (let colIdx = 0; colIdx < line.length; colIdx++) {
		const cell = line[colIdx];
		if (cell === "S") {
			startCoords = [rowIdx, colIdx];
			parsedLine.push(START_ELEVATION);
			initialDistances.push(0);
		} else if (cell === "E") {
			endCoords = [rowIdx, colIdx];
			parsedLine.push(END_ELEVATION);
			initialDistances.push(Infinity);
		} else {
			parsedLine.push(cell.charCodeAt(0) - "a".charCodeAt(0));
			initialDistances.push(Infinity);
		}
		unvisitedNodes.add(getNodeKey([rowIdx, colIdx]));
	}
	nodes.push(parsedLine);
	distancesFromStart.push(initialDistances);
}

const ROW_COUNT = nodes.length;
const COL_COUNT = nodes[0].length;

/* -------------------------------------------------------------------------- */
/*                                   Solver                                   */
/* -------------------------------------------------------------------------- */

const findNeighbouringNodeCoords = ([row, col]: [number, number]) => {
	const neighbours: [number, number][] = [];
	if (row > 0) neighbours.push([row - 1, col]);
	if (col > 0) neighbours.push([row, col - 1]);
	if (row < ROW_COUNT) neighbours.push([row + 1, col]);
	if (col < COL_COUNT) neighbours.push([row, col + 1]);
	return neighbours;
};
const possibleNextNodeCoords = ([row, col]: [number, number]) => findNeighbouringNodeCoords([row, col])
	.filter(coords => {
		if (!unvisitedNodes.has(getNodeKey(coords))) return false;
		const currentHeight = nodes[row][col];
		const nextHeight = nodes[coords[0]][coords[1]];
		return nextHeight <= (currentHeight + 1);
	});

function findShortestPath() {
	if (startCoords == null || endCoords == null) {
		throw new Error("Couldn't find start and/or end");
	}

	while (unvisitedNodes.size > 0) {
		const currentCoords = Array.from(unvisitedNodes).map(key => {
			const [xStr, yStr] = key.split(",");
			const coords: [number, number] = [Number(xStr), Number(yStr)]
			const [x, y] = coords;
			return { coords: coords, dist: distancesFromStart[x][y] };
		}).sort((a, b) => a.dist - b.dist)[0].coords;

		const currentNodeKey = getNodeKey(currentCoords);
		unvisitedNodes.delete(currentNodeKey);

		if (currentNodeKey === getNodeKey(endCoords)) {
			let previous: string | undefined = currentNodeKey;
			const path: string[] = [currentNodeKey];
			let steps = -1;
			while (previous) {
				previous = previousNodeLookup[previous];
				if (previous) path.push(previous);
				steps++;
			}
			return {
				steps,
				path: path.reverse(),
			};
		}

		const [cx, cy] = currentCoords;
		const neighbours = possibleNextNodeCoords(currentCoords);
		for (const [nx, ny] of neighbours) {
			const distFromStart = (distancesFromStart[cx][cy] ?? 0) + 1;
			if (distFromStart < distancesFromStart[nx][ny]) {
				distancesFromStart[nx][ny] = distFromStart;
				previousNodeLookup[getNodeKey([nx, ny])] = getNodeKey([cx, cy]);
			}
		}
	}

	throw new Error("Couldn't find any path");
}

function _printPath(path: string[]) {
	let debug = "";
	for (let rowIdx = 0; rowIdx < ROW_COUNT; rowIdx++) {
		for (let colIdx = 0; colIdx < COL_COUNT; colIdx++) {
			const key = getNodeKey([rowIdx, colIdx]);
			const stepIdx = path.findIndex(x => x == key);
			debug += stepIdx > -1 ? String(stepIdx).padEnd(3, " ") : ".  ";
		}
		debug += "\n";
	}
	console.log(debug);
}

const res = findShortestPath();
console.log(res.steps);
// _printPath(res.path);
