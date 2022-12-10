import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

let lineIdx = 0;
let cycleNum = 1;
let registerValue = 1;
let pendingAddition = null;
let signalStrengthSum = 0;

while (lineIdx < lines.length || pendingAddition !== null) {
	// console.log(cycleNum, registerValue);
	if (cycleNum === 20 || (cycleNum - 20) % 40 === 0) {
		signalStrengthSum += registerValue * cycleNum;
	}

	if (pendingAddition !== null) {
		registerValue += pendingAddition;
		pendingAddition = null;
	} else {
		const line = lines[lineIdx++];
		if (line === "noop") {
			// do nothing
		} else if (line.startsWith("addx ")) {
			const toAdd = Number(line.split(" ")[1]);
			pendingAddition = toAdd;
		} else {
			throw new Error(`Unexpected command: ${line}`);
		}
	}
	cycleNum++;
}

console.log(signalStrengthSum);
