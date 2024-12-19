import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testCases = [
	{
		input: `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
		expected: 16,
	},
];

Deno.test("day 18", () => {
	for (const { input, expected } of testCases) {
		assertEquals(solve(input), expected);
	}
});
