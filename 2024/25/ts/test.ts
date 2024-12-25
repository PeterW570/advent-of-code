import { assertEquals } from "jsr:@std/assert";

import { parseKey, parseLock, solve } from "./solver.ts";

const testCases = [
	{
		input: `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`,
		expected: 3,
	},
];

Deno.test("day 25", () => {
	assertEquals(
		parseLock(["#####", ".####", ".####", ".####", ".#.#.", ".#...", "....."]),
		[0, 5, 3, 4, 3]
	);

	assertEquals(
		parseKey([".....", "#....", "#....", "#...#", "#.#.#", "#.###", "#####"]),
		[5, 0, 2, 1, 3]
	);

	for (const { input, expected } of testCases) {
		assertEquals(solve(input), expected);
	}
});
