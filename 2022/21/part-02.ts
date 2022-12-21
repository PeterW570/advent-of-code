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

function monkeyHasDependency(name: string, target: string): boolean {
	if (name === target) return true;
	const instructions = monkeyInstructions[name];
	assertIsDefined(instructions);
	if (typeof instructions === "number") {
		return false;
	} else {
		const deps = [instructions[0], instructions[2]];
		return deps.some(dep => dep === target || monkeyHasDependency(dep, target));
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

const HUMAN = "humn";
const rootInstructions = monkeyInstructions["root"] as string[];
const rootDeps = [rootInstructions[0], rootInstructions[2]];
const depWithoutHumanDep = rootDeps.find(dep => !monkeyHasDependency(dep, HUMAN));
const depWithHumanDep = rootDeps.find(dep => monkeyHasDependency(dep, HUMAN));
assertIsDefined(depWithoutHumanDep);
assertIsDefined(depWithHumanDep);
const target = valueForMonkey(depWithoutHumanDep);
let humanValue = target;

let currentMonkey = depWithHumanDep;
while (currentMonkey !== HUMAN) {
	const instructions = monkeyInstructions[currentMonkey];
	assertIsDefined(instructions);

	if (typeof instructions === "number") throw new Error("Don't think this should happen..." + currentMonkey);
	else {
		const [mOne, op, mTwo] = instructions;
		if (monkeyHasDependency(mOne, HUMAN)) {
			switch (op) {
				case "+":
					humanValue -= valueForMonkey(mTwo);
					break;
				case "-":
					humanValue += valueForMonkey(mTwo);
					break;
				case "*":
					humanValue /= valueForMonkey(mTwo);
					break;
				case "/":
					humanValue *= valueForMonkey(mTwo);
					break;
				default:
					throw new Error("Unexpected op");
			}
			currentMonkey = mOne;
		} else {
			switch (op) {
				case "+":
					humanValue -= valueForMonkey(mOne);
					break;
				case "-":
					humanValue = valueForMonkey(mOne) - humanValue;
					break;
				case "*":
					humanValue /= valueForMonkey(mOne);
					break;
				case "/":
					humanValue = valueForMonkey(mOne) / humanValue;
					break;
				default:
					throw new Error("Unexpected op");
			}
			currentMonkey = mTwo;
		}
	}
}

console.log(humanValue);
