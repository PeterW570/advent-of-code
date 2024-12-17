import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testCases = [
	{
		input: `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`,
		expected: 117440n,
	},
];

Deno.test("day 17", () => {
	for (const { input, expected } of testCases) {
		assertEquals(solve(input), expected);
	}
});
