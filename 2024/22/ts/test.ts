import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testCases = [
	{
		input: `1
2
3
2024`,
		expected: 23,
	},
];

Deno.test("day 22", () => {
	for (const { input, expected } of testCases) {
		assertEquals(solve(input), expected);
	}
});
