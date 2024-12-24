export function solve(input: string): number {
	const lines = input.split("\n");

	const connections = new Map<string, Set<string>>();
	const connectedSets = new Set<string>();

	for (const line of lines) {
		const computers = line.split("-");

		const existingOne = connections.get(computers[0]) ?? new Set<string>();
		existingOne.add(computers[1]);
		connections.set(computers[0], existingOne);

		const existingTwo = connections.get(computers[1]) ?? new Set<string>();
		existingTwo.add(computers[0]);
		connections.set(computers[1], existingTwo);
	}

	for (const [computer, connectedToSet] of connections) {
		if (!computer.startsWith("t")) continue;

		const connectedTo = Array.from(connectedToSet);
		for (let i = 0; i < connectedTo.length; i++) {
			for (let j = i; j < connectedTo.length; j++) {
				const connectionA = connectedTo[i];
				const connectionB = connectedTo[j];

				if (connections.get(connectionA)?.has(connectionB)) {
					connectedSets.add([computer, connectionA, connectionB].sort().join("-"));
				}
			}
		}
	}

	return connectedSets.size;
}
