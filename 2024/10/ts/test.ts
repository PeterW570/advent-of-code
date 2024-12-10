import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testInputSmall = `0123
1234
8765
9876`;

const testInputMid = `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`;

const testInputBig = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

Deno.test("day 10", () => {
	assertEquals(solve(testInputSmall), 1);
	assertEquals(solve(testInputMid), 4);
	assertEquals(solve(testInputBig), 36);
});
