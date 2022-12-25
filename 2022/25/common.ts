export type SnafuChar = 2 | 1 | 0 | "-" | "=";

export function parseSnafuString(input: string) {
	const splits = input.split("");
	const parsed: SnafuChar[] = [];
	for (const char of splits) {
		switch (char) {
			case "2":
				parsed.push(2);
				break;
			case "1":
				parsed.push(1);
				break;
			case "0":
				parsed.push(0);
				break;
			case "-":
				parsed.push("-");
				break;
			case "=":
				parsed.push("=");
				break;
			default:
				throw new Error("Unhandled char");
		}
	}
	return parsed;
}

export function snafuToDec(input: SnafuChar[]) {
	const maxIdx = input.length - 1;
	let decValue = 0;
	for (let i = 0; i <= maxIdx; i++) {
		const char = input[maxIdx - i];
		const placeValue = 5 ** i;
		if (char === "-") {
			decValue -= placeValue;
		} else if (char === "=") {
			decValue -= 2 * placeValue;
		} else {
			decValue += char * placeValue;
		}
	}
	return decValue;
}

function quantityToSnafuChar(input: number): SnafuChar {
	if (input === -2) return "=";
	else if (input === -1) return "-";
	else if (input === 0) return 0;
	else if (input === 1) return 1;
	else if (input === 2) return 2;
	else throw new Error("Unhandled input");
}

export function decToSnafu(input: number) {
	const snafu: SnafuChar[] = [];
	const cumulativeMaxes: number[] = [];
	const individualMaxes: number[] = [];
	
	let cumulativeMax = 0
	let position = 0;
	while (cumulativeMax < input) {
		const individualMax = 2 * 5 ** position++;
		cumulativeMax += individualMax;
		individualMaxes.push(individualMax);
		cumulativeMaxes.push(cumulativeMax);
	}

	let pending = 0;
	while (position > 0) {
		position--;
		const positionBase = 5 ** position;
		const potential = [-2, -1, 0, 1, 2]
			.map(x => ({ quantity: x, diff: Math.abs(pending + x * positionBase - input) }))
			.sort((a, b) => a.diff - b.diff);
		const best = potential[0].quantity;
		snafu.push(quantityToSnafuChar(best));
		pending += potential[0].quantity * positionBase;
	}

	return snafu;
}
