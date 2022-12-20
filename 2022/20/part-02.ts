import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

import { move } from './common.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));

const DECRYPTION_KEY = 811589153;
const MIXING_COUNT = 10;

const inputNumbers = input.split("\n").map(str => Number(str) * DECRYPTION_KEY);

const COUNT = inputNumbers.length;
const toRearrange = inputNumbers.map((num, i) => ({ originalIndex: i, moveBy: num }));

for (let i = 0; i < MIXING_COUNT; i++) {
	for (let j = 0; j < COUNT; j++) {
		const matchIdx = toRearrange.findIndex(x => x.originalIndex === j);
		if (matchIdx < 0) throw new Error("Couldn't find match");
		move(toRearrange, matchIdx, toRearrange[matchIdx].moveBy);
	}
}

const rearranged = toRearrange.map(x => x.moveBy);
const zeroIndex = rearranged.findIndex(x => x === 0);
const groveCoordinates = rearranged[(zeroIndex + 1000) % COUNT] + rearranged[(zeroIndex + 2000) % COUNT] + rearranged[(zeroIndex + 3000) % COUNT];

console.log(groveCoordinates);
