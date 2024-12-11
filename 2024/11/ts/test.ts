import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testInput = `125 17`;

Deno.test("day 11", () => {
	assertEquals(solve(testInput), 55312);
});
