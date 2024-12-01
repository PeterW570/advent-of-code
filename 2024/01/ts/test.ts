import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testInput = `3   4
4   3
2   5
1   3
3   9
3   3`;

Deno.test("day 01", () => {
	assertEquals(solve(testInput), 11);
});
