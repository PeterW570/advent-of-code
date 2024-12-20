import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testInput = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

const test2 = "95 92 93 94 95 97";

Deno.test("day 02", () => {
	assertEquals(solve(testInput), 4);
	assertEquals(solve(test2), 1);
});
