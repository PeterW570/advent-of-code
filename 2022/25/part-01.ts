import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

import { decToSnafu, SnafuChar, snafuToDec } from './common.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

const parsedLines: SnafuChar[][] = [];

for (const line of lines) {
	const splits = line.split("");
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
	parsedLines.push(parsed);
}

let decSum = 0;
for (const line of parsedLines) {
	decSum += snafuToDec(line);
}

console.log(decSum);

const snafuSum = decToSnafu(decSum);

console.log(snafuSum.join(""));
