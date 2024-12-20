import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testCases = [
	{
		input: `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`,
		targetSaving: 72,
		expected: 3 + 4 + 22,
	},
];

Deno.test("day 20", () => {
	for (const { input, targetSaving, expected } of testCases) {
		assertEquals(solve(input, targetSaving), expected);
	}
});
