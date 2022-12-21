import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

import { assertIsDefined } from '../utils.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

const monkeyInstructions: Partial<Record<string, number | string[]>> = {};
for (const line of lines) {
	const splits = line.split(" ");
	const name = splits[0].slice(0, -1);
	if (splits.length === 2) {
		monkeyInstructions[name] = Number(splits[1]);
	} else {
		monkeyInstructions[name] = splits.slice(1);
	}
}

function valueForMonkey(name: string): number {
	const instructions = monkeyInstructions[name];
	assertIsDefined(instructions);
	if (typeof instructions === "number") {
		return instructions;
	} else {
		const [mOne, op, mTwo] = instructions;
		switch (op) {
			case "+":
				return valueForMonkey(mOne) + valueForMonkey(mTwo);
			case "-":
				return valueForMonkey(mOne) - valueForMonkey(mTwo);
			case "*":
				return valueForMonkey(mOne) * valueForMonkey(mTwo);
			case "/":
				return valueForMonkey(mOne) / valueForMonkey(mTwo);
			default:
				throw new Error("Unexpected op");
		}
	}
}

console.log(valueForMonkey("root"));
