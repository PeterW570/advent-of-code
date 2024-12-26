import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface Gate {
	key: string;
	inputs: string[];
	op: string;
	output: string;
}

function generateGraph(dependencies: Record<string, Gate>) {
	const xBuf: string[] = [];
	const yBuf: string[] = [];
	const buf: string[] = [];

	xBuf.push("\n");
	yBuf.push("\n");

	buf.push("digraph G {\n");

	const depList: string[][] = [];
	for (const w in dependencies) {
		const d = dependencies[w];
		depList.push([d.inputs[0], w, d.op]);
		depList.push([d.inputs[1], w.split(" -> ")[0], d.op]);
	}

	depList.sort((a, b) => a[1].localeCompare(b[1]));

	for (const pair of depList) {
		let color: string;
		switch (pair[2]) {
			case "XOR":
				color = "red";
				break;
			case "AND":
				color = "blue";
				break;
			case "OR":
				color = "green";
				break;
			default:
				color = "black";
		}
		buf.push(
			`${pair[0]} -> ${pair[1].replace(` ${pair[2]} `, `_${pair[2]}_`)} [color = ${color}];\n`
		);
	}
	buf.push("}");

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);

	Deno.writeTextFileSync(join(__dirname, "out.dot"), buf.join(""));
}

export function solve(input: string): string {
	const lines = input.split("\n");

	let parsingState = true;

	const state = new Map<string, number>();
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

	// generates graph in graphviz dot language
	generateGraph(gatesByKey);

	// copy the file output to https://dreampuf.github.io/GraphvizOnline (or similar)
	// and look for any zn outputs that aren't joined by two XORs (red wires) to
	// the corresponding xn, yn inputs. Then look for which wires need to be switched to fix it

	return ["z10", "vcf", "z17", "fhg", "fsq", "dvb", "z39", "tnc"].sort().join(",");
}
