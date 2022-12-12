import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const rawInfoForMonkeys = input.split("\n\n");

enum OperationOp {
	Multiply,
	Add,
}
const opLookup: Partial<Record<string, OperationOp>> = {
	"*": OperationOp.Multiply,
	"+": OperationOp.Add,
};

interface MonkeyInfo {
	operation: (input: number) => number;
	test: (input: number) => boolean;
	throwToMonkey: (testResult: boolean) => number;
}
const monkeyInfo: Map<number, MonkeyInfo> = new Map();
const currentItems: Map<number, number[]> = new Map();

let testDivisorProduct = 1;

for (const info of rawInfoForMonkeys) {
	const lines = info.split("\n");
	
	const monkeyNumber = Number(lines[0].match(/Monkey (\d+)/)?.[1]);
	if (isNaN(monkeyNumber)) throw new Error("Failed to parse monkey number");
	
	const startingItems = lines[1].trim().slice("Starting items: ".length).split(", ").map(str => Number(str));
	currentItems.set(monkeyNumber, startingItems);

	const operationTokens = lines[2].trim().slice("Operation: new = ".length).split(" ");
	if (operationTokens.length !== 3) throw new Error("Operation longer than expected");
	const [firstVar, rawOp, secondVar] = operationTokens;
	const op = opLookup[rawOp];
	if (op === undefined) throw new Error("Unhandled op: " + rawOp);
	const operation = (old: number) => {
		const first = (firstVar === "old" ? old : Number(firstVar));
		const second = (secondVar === "old" ? old : Number(secondVar));
		switch (op) {
			case OperationOp.Multiply:
				return first * second;
			case OperationOp.Add:
				return first + second;
		}
	};

	const testDivisor = Number(lines[3].trim().match(/^Test: divisible by (\d+)$/)?.[1]);
	if (isNaN(testDivisor)) throw new Error("Failed to parse test divisor");
	const test = (input: number) => input % testDivisor === 0;
	testDivisorProduct *= testDivisor;

	const ifTrue = Number(lines[4].trim().match(/If true: throw to monkey (\d+)/)?.[1]);
	const ifFalse = Number(lines[5].trim().match(/If false: throw to monkey (\d+)/)?.[1]);
	if (isNaN(ifTrue) || isNaN(ifFalse)) throw new Error ("Failed to parse monkey to throw to");
	const throwToMonkey = (testRes: boolean) => testRes ? ifTrue : ifFalse;

	monkeyInfo.set(monkeyNumber, { operation, test, throwToMonkey });
}

const ROUND_COUNT = 10_000;
const MONKEY_COUNT = rawInfoForMonkeys.length;

const inspectionsPerMonkey: Map<number, number> = new Map();

for (let roundNum = 0; roundNum < ROUND_COUNT; roundNum++) {
	for (let monkeyNum = 0; monkeyNum < MONKEY_COUNT; monkeyNum++) {
		const info = monkeyInfo.get(monkeyNum);
		if (!info) throw new Error("Unable to find monkey info");
		
		const items = currentItems.get(monkeyNum);
		if (!items) throw new Error("Unable to find monkey items");

		for (const item of items) {
			const inspectedValue = info.operation(item) % testDivisorProduct;
			const testRes = info.test(inspectedValue);
			const nextMonkey = info.throwToMonkey(testRes);
			currentItems.get(nextMonkey)?.push(inspectedValue);
			inspectionsPerMonkey.set(monkeyNum, (inspectionsPerMonkey.get(monkeyNum) || 0) + 1);
		}

		currentItems.set(monkeyNum, []);
	}
}

const sortedInspectionCounts = Array.from(inspectionsPerMonkey.entries()).sort((m1, m2) => m2[1] - m1[1]);
const monkeyBusiness = sortedInspectionCounts[0][1] * sortedInspectionCounts[1][1];
console.log(monkeyBusiness);
