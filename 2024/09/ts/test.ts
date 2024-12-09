import { assertEquals } from "jsr:@std/assert";

import { compact, convertMapToBlocks, solve } from "./solver.ts";

const testInput = `2333133121414131402`;

const testWithMultiDigits = "233400000000000000003";

Deno.test("day 09", () => {
	const converted = convertMapToBlocks(testInput);
	assertEquals(converted[0].join(""), "00...111...2...333.44.5555.6666.777.888899");
	assertEquals(converted[1], 9);
	assertEquals(compact(converted[0], 9).join(""), "00992111777.44.333....5555.6666.....8888..");
	assertEquals(solve(testInput), 2858);

	const convertedMultiDigits = convertMapToBlocks(testWithMultiDigits);
	assertEquals(convertedMultiDigits[0].join(""), "00...111....101010");
	assertEquals(convertedMultiDigits[1], 10);
	assertEquals(compact(convertedMultiDigits[0], 10).join(""), "00101010111.......");
	assertEquals(solve(testWithMultiDigits), 108);
});
