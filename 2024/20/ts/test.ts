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
		targetSaving: 10,
		expected: 10,
	},
];

Deno.test("day 20", () => {
	for (const { input, targetSaving, expected } of testCases) {
		assertEquals(solve(input, targetSaving), expected);
	}
});
