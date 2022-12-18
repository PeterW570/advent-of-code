import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

interface ValveInfo {
	flowRate: number;
	tunnelsTo: string[];
}

const valveInfo: Record<string, ValveInfo> = {};

const valvesToOpen: Set<string> = new Set();
const allValves: string[] = [];

for (const line of lines) {
	const match = line.match(/Valve (?<id>\w+) has flow rate=(?<rate>\d+); tunnels? leads? to valves? (?<tunnels>.*)/);
	if (!match?.groups) throw new Error("Failed to parse input");
	const { id, rate, tunnels } = match.groups;
	allValves.push(id);
	valveInfo[id] = {
		flowRate: Number(rate),
		tunnelsTo: tunnels.split(", ")
	}
	if (Number(rate) > 0) valvesToOpen.add(id);
}

interface PotentialInfo {
	id: string;
	path: string[];
	distance: number;
	flowRate: number;
}
const potentialForNode: Record<string, PotentialInfo[]> = {};

function getPotential(startId: string) {
	const queue: { id: string; path: string[] }[] = [{ id: startId, path: [] }];
	const visited: Set<string> = new Set();
	const toVisit = new Set(valvesToOpen);
	const potentialValues: PotentialInfo[] = [];

	while (toVisit.size) {
		const current = queue.shift();
		if (!current) break;
		toVisit.delete(current.id);
		visited.add(current.id);
		const flowRate = valveInfo[current.id].flowRate;
		if (flowRate > 0 && !potentialValues.some(x => x.id === current.id) && valvesToOpen.has(current.id)) {
			potentialValues.push({
				id: current.id,
				path: current.id === startId ? [] : current.path.slice(1).concat(current.id),
				distance: current.path.length,
				flowRate,
			});
		}
		for (const tunnelId of valveInfo[current.id].tunnelsTo) {
			if (visited.has(tunnelId)) continue;
			queue.push({
				id: tunnelId,
				path: current.path.concat(current.id)
			});
		}
	}

	return potentialValues;
}

for (const valveId of allValves) {
	potentialForNode[valveId] = getPotential(valveId);
}

console.log(`found all potential info`);
// console.log(potentialForNode);

interface Solution {
	openedValves: Set<string>;
	total: number;
}

function generatePossibleSolutions(nodeId: string, maxTime: number): Solution[] {
	function recurse(nodeId: string, opened: string[], total: number, currentFlowRate: number, remainingTime: number): Solution[] {
		let possibilities: Solution[] = [];
		if (valvesToOpen.size === opened.length) {
			possibilities.push({
				total: total + remainingTime * currentFlowRate,
				openedValves: new Set(opened),
			});
			return possibilities;
		}

		for (const info of potentialForNode[nodeId]) {
			if (opened.includes(info.id)) continue;
			const dist = info.distance;
			if (dist + 1 > remainingTime) continue;
			const newTotal = total + (dist + 1) * currentFlowRate;
			possibilities = possibilities.concat(recurse(info.id, opened.concat(info.id), newTotal, currentFlowRate + info.flowRate, remainingTime - (dist + 1)));
		}
		possibilities.push({
			total: total + remainingTime * currentFlowRate,
			openedValves: new Set(opened),
		});
		return possibilities;
	}
	return recurse(nodeId, [], 0, 0, maxTime);
}

const START = "AA";

const possiblePartOne = generatePossibleSolutions(START, 30)
	.sort((a, b) => b.total - a.total);

const partOne = possiblePartOne[0].total;
console.log(`Part 1: ${partOne}`);


const possiblePartTwo = generatePossibleSolutions(START, 26)
	.sort((a, b) => b.total - a.total);

let partTwo = 0;
for (let i = 0; i < possiblePartTwo.length - 1; i++) {
	const possibleA = possiblePartTwo[i];
	let max = 0;
	for (let j = i + 1; i < possiblePartTwo.length; j++) {
		const possibleB = possiblePartTwo[j];
		if (Array.from(possibleA.openedValves).some(x => possibleB.openedValves.has(x))) continue;
		const combined = possibleA.total + possibleB.total;
		max = combined;
		break;
	}
	partTwo = Math.max(partTwo, max);
}

console.log(`Part 2: ${partTwo}`);
