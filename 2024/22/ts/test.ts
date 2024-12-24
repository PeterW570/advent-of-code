import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testCases = [
	{
		input: `1
10
100
2024`,
		expected: 37327623,
	},
];

Deno.test("day 22", () => {
	for (const { input, expected } of testCases) {
		assertEquals(solve(input), expected);
	}
});
