import { assertEquals } from 'jsr:@std/assert';

import { solve } from './solver.ts';

const testInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

Deno.test("day 06", () => {
	assertEquals(solve(testInput), 6);
});
