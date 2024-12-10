import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testInputSmall = `.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....`;

const testInputMid = `012345
123456
234567
345678
4.6789
56789.`;

const testInputBig = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

Deno.test("day 10", () => {
	assertEquals(solve(testInputSmall), 3);
	assertEquals(solve(testInputMid), 227);
	assertEquals(solve(testInputBig), 81);
});
