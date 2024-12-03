export function solve(input: string): number {
	let sum = 0;

	const matches = input.matchAll(/(?:mul\((\d+),(\d+)\))|(?:do\(\))|(?:don't\(\))/gm);
	let enabled = true;
	for (const match of matches) {
		if (match[0] === "do()") enabled = true;
		else if (match[0] === "don't()") enabled = false;
		else if (enabled) sum += parseInt(match[1]) * parseInt(match[2]);
	}
	return sum;
}
