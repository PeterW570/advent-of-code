export function solve(input: string): number {
	let total = 0;

	const lines = input.split("\n");
	const rules: [string, string][] = [];
	const pages: string[][] = [];

	for (const line of lines) {
		if (line.includes("|")) {
			const splits = line.split("|");
			rules.push([splits[0], splits[1]]);
		} else if (line.length) {
			pages.push(line.split(","));
		}
	}

	for (const page of pages) {
		let wasIncorrect = false;
		let valid = true;

		do {
			valid = true;
			for (const rule of rules) {
				const aIdx = page.findIndex((x) => x === rule[0]);
				const bIdx = page.findIndex((x) => x === rule[1]);
				if (aIdx > -1 && bIdx > -1 && bIdx < aIdx) {
					valid = false;
					wasIncorrect = true;
					page.splice(bIdx, 1);
					page.splice(aIdx, 0, rule[1]);
					break;
				}
			}
		} while (!valid);

		if (wasIncorrect) {
			total += parseInt(page[Math.floor(page.length / 2)]);
		}
	}

	return total;
}
