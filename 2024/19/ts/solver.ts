function canMakeDesign(design: string, availablePatterns: string[]) {
	for (const pattern of availablePatterns) {
		if (design === pattern) return true;
		if (!design.startsWith(pattern)) continue;

		if (canMakeDesign(design.slice(pattern.length), availablePatterns)) return true;
	}
	return false;
}

export function solve(input: string): number {
	const lines = input.split("\n");

	const availablePatterns = lines[0].split(", ");

	let designable = 0;

	for (const design of lines.slice(2)) {
		if (canMakeDesign(design, availablePatterns)) {
			designable++;
		}
	}

	return designable;
}
