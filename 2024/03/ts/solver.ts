export function solve(input: string): number {
	let sum = 0;

	const matches = input.matchAll(/mul\((\d+),(\d+)\)/gm);
	for (const match of matches) {
		sum += parseInt(match[1]) * parseInt(match[2]);
	}
	return sum;
}
