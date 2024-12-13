import { assertEquals } from "jsr:@std/assert";

import { getCost } from "./solver.ts";

Deno.test("day 13", () => {
	assertEquals(
		getCost({
			buttonA: { x: 94, y: 34 },
			buttonB: { x: 22, y: 67 },
			prize: { x: 8400, y: 5400 },
		}),
		280
	);
	assertEquals(
		getCost({
			buttonA: { x: 26, y: 66 },
			buttonB: { x: 67, y: 21 },
			prize: { x: 12748, y: 12176 },
		}),
		0
	);
	assertEquals(
		getCost({
			buttonA: { x: 17, y: 86 },
			buttonB: { x: 84, y: 37 },
			prize: { x: 7870, y: 6450 },
		}),
		200
	);
	assertEquals(
		getCost({
			buttonA: { x: 69, y: 23 },
			buttonB: { x: 27, y: 71 },
			prize: { x: 18641, y: 10279 },
		}),
		0
	);
});
