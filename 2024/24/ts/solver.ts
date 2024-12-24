const AND = (a: number, b: number) => a && b;
const OR = (a: number, b: number) => a || b;
const XOR = (a: number, b: number) => a ^ b;

const state = new Map<string, number>();

interface Gate {
	key: string;
	inputs: string[];
	op: string;
	output: string;
}

export function solve(input: string): number {
	const lines = input.split("\n");

	let parsingState = true;

	const gatesByKey: Record<string, Gate> = {};
	const toProcess = new Set<string>();

	for (const line of lines) {
		if (parsingState && line.trim() === "") {
			parsingState = false;
		} else if (parsingState) {
			const [key, val] = line.split(": ");
			state.set(key, parseInt(val));
		} else {
			const [lhs, rhs] = line.split(" -> ");
			const [a, op, b] = lhs.split(" ");
			toProcess.add(line);
			gatesByKey[line] = {
				key: line,
				inputs: [a, b],
				op,
				output: rhs,
			};
		}
	}

	while (toProcess.size) {
		for (const key of toProcess) {
			const gate = gatesByKey[key];
			if (!gate.inputs.every((input) => state.has(input))) continue;
			const [a, b] = gate.inputs.map((key) => state.get(key));
			if (a === undefined || b === undefined)
				throw new Error("couldn't get values for inputs");

			let res: number;
			if (gate.op === "AND") {
				res = AND(a, b);
			} else if (gate.op === "OR") {
				res = OR(a, b);
			} else if (gate.op === "XOR") {
				res = XOR(a, b);
			} else {
				throw new Error("unhandled op");
			}

			state.set(gate.output, res);
			toProcess.delete(key);
		}
	}

	return parseInt(
		Array.from(state.keys())
			.filter((x) => x[0] === "z")
			.sort()
			.reverse()
			.map((key) => state.get(key))
			.join(""),
		2
	);
}
