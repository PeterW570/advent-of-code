import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testCases = [
	{
		input: `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`,
		expected: "4,6,3,5,6,3,5,2,1,0",
	},
];

Deno.test("day 17", () => {
	for (const { input, expected } of testCases) {
		assertEquals(solve(input), expected);
	}
});
