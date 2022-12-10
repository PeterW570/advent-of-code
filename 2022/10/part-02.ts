import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

const ROW_LENGTH = 40;

let lineIdx = 0;
let cycleNum = 1;
let registerValue = 1;
let pendingAddition = null;

let pixelPosition = 0;
const isLit = () => pixelPosition >= registerValue - 1 && pixelPosition <= registerValue + 1;
let output = "";

while (lineIdx < lines.length || pendingAddition !== null) {
	// console.log(cycleNum, registerValue);
	output += isLit() ? "#" : ".";

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
	pixelPosition = (cycleNum - 1) % ROW_LENGTH;
	if (pixelPosition === 0) output += "\n";
}

console.log(output);
