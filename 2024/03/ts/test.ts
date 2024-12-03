import { assertEquals } from 'jsr:@std/assert';

import { solve } from './solver.ts';

const testInput = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

Deno.test("day 03", () => {
	assertEquals(solve(testInput), 48);
});
