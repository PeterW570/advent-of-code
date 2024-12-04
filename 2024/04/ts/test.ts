import { assertEquals } from 'jsr:@std/assert';

import { solve } from './solver.ts';

const testInput = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

Deno.test("day 04", () => {
	assertEquals(solve(testInput), 9);
});
