import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

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

const firstDivider = [[2]];
const secondDivider = [[6]];

const sortedPackets = lines
	.filter(str => str.trim().length > 0)
	.map(packetStr => JSON.parse(packetStr))
	.concat([firstDivider, secondDivider])
	.sort((a, b) => {
		const comp = comparePairs(a, b);
		return comp ? -1 : comp === false ? 1 : 0;
	});

const firstIdx = sortedPackets.findIndex(x => x === firstDivider) + 1;
const secondIdx = sortedPackets.findIndex(x => x === secondDivider) + 1;

const doctorKey = firstIdx * secondIdx;
console.log(doctorKey);
