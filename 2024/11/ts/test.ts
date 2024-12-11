import { assertEquals } from "jsr:@std/assert";

import { getCountAfterIterations } from "./solver.ts";

const testInput = `125 17`;

Deno.test("day 11", () => {
	assertEquals(getCountAfterIterations(testInput.split(" ").map(Number), 25), 55312);
});
