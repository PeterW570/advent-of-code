// https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
function bronKerbosch(
	R: Set<string>,
	P: Set<string>,
	X: Set<string>,
	O: Set<string>,
	connections: Map<string, Set<string>>
) {
	if (P.size === 0 && X.size === 0) {
		O.add(Array.from(R).sort().join(","));
		return;
	}
	const PC = new Set(P);
	for (const v of P) {
		const C = connections.get(v);
		if (!C) throw new Error("v not found in connections");

		bronKerbosch(new Set([...R, v]), PC.intersection(C), X.intersection(C), O, connections);
		PC.delete(v);
		X.add(v);
	}
}

export function solve(input: string): string {
	const lines = input.split("\n");

	const connections = new Map<string, Set<string>>();
	const connectedSets = new Set<string>();

	for (const line of lines) {
		connectedSets.add(line);
		const computers = line.split("-");

		const existingOne = connections.get(computers[0]) ?? new Set<string>();
		existingOne.add(computers[1]);
		connections.set(computers[0], existingOne);

		const existingTwo = connections.get(computers[1]) ?? new Set<string>();
		existingTwo.add(computers[0]);
		connections.set(computers[1], existingTwo);
	}

	const maximalSet = new Set<string>();
	bronKerbosch(new Set(), new Set(connections.keys()), new Set(), maximalSet, connections);

	return Array.from(maximalSet).sort((a, b) => b.length - a.length)[0];
}
