import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const inputNumbers = input.split("\n").map(str => Number(str));

const COUNT = inputNumbers.length;
const toRearrange = inputNumbers.map((num, i) => ({ originalIndex: i, moveBy: num }));

for (let i = 0; i < COUNT; i++) {
	const matchIdx = toRearrange.findIndex(x => x.originalIndex === i);
	if (matchIdx < 0) throw new Error("Couldn't find match");
	const toMove = toRearrange.splice(matchIdx, 1)[0];
	toRearrange.splice((matchIdx + toMove.moveBy) % toRearrange.length, 0, toMove);
}

const rearranged = toRearrange.map(x => x.moveBy);
const zeroIndex = rearranged.findIndex(x => x === 0);
const groveCoordinates = rearranged[(zeroIndex + 1000) % COUNT] + rearranged[(zeroIndex + 2000) % COUNT] + rearranged[(zeroIndex + 3000) % COUNT];

console.log(groveCoordinates);
