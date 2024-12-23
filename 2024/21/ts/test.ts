import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testCases = [
	{
		input: `029A
980A
179A
456A
379A`,
		expected: 126384,
	},
];

Deno.test("day 21", () => {
	for (const { input, expected } of testCases) {
		assertEquals(solve(input), expected);
	}
});
