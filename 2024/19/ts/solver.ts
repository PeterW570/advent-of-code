const cache = new Map<string, number>();

function waysToMake(design: string, availablePatterns: string[]): number {
	let count = 0;
	if (cache.has(design)) return cache.get(design)!;
	for (const pattern of availablePatterns) {
		if (design === pattern) count++;
		if (!design.startsWith(pattern)) continue;

		count += waysToMake(design.slice(pattern.length), availablePatterns);
	}
	cache.set(design, count);
	return count;
}

export function solve(input: string): number {
	const lines = input.split("\n");

	const availablePatterns = lines[0].split(", ");

	let count = 0;

	for (const design of lines.slice(2)) {
		count += waysToMake(design, availablePatterns);
	}

	return count;
}
