import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const inputPairs = input.split("\n\n");

function comparePairs(left: unknown, right: unknown): boolean | null {
	if (typeof left === "number" && typeof right === "number") {
		return left < right ? true
			: right < left ? false
				: null;
	}

	if (typeof left === "number") {
		left = [left]
	}
	if (typeof right === "number") {
		right = [right];
	}

	if (!Array.isArray(left) || !Array.isArray(right)) throw new Error("left & right should be array");

	for (let i = 0; i < Math.max(left.length, right.length); i++) {
		const leftEl = left[i];
		const rightEl = right[i];
		if (leftEl === undefined) return true;
		else if (rightEl === undefined) return false;

		const comp = comparePairs(leftEl, rightEl);
		if (comp !== null) return comp;
	}

	return null;
}

let sum = 0;
for (let i = 0; i < inputPairs.length; i++) {
	const pair = inputPairs[i];
	const [left, right] = pair.split("\n");
	const leftParsed = JSON.parse(left);
	const rightParsed = JSON.parse(right);
	const comp = comparePairs(leftParsed, rightParsed);
	if (comp) sum += i + 1;
}

console.log(sum);
