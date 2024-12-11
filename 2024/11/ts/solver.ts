export function blink(input: string) {
	const splits = input.split(" ");
	const output = [];

	for (const split of splits) {
		if (split === "0") {
			output.push("1");
		} else if (split.length % 2 === 0) {
			output.push(
				`${parseInt(split.slice(0, split.length / 2))}`,
				`${parseInt(split.slice(split.length / 2))}` // so that e.g. "00" becomes "0"
			);
		} else {
			output.push(`${parseInt(split) * 2024}`);
		}
	}

	return output.join(" ");
}

export function solve(input: string): number {
	let transformed = input;
	for (let i = 0; i < 25; i++) {
		transformed = blink(transformed);
	}

	return transformed.split(" ").length;
}
