import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "../input.txt"));
const lines = input.split("\n");

const totals = [];
let current = 0;
for (const line of lines) {
    if (line.trim() === "") {
        totals.push(current);
        current = 0;
    } else {
        current += Number(line);
    }
    
}
totals.push(current);
totals.sort((a, b) => a > b ? -1 : 1);

const topThreeTotal = totals[0] + totals[1] + totals[2];

console.log(topThreeTotal);
