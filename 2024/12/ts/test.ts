import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testInputOne = `AAAA
BBCD
BBCC
EEEC`;

const testInputTwo = `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`;

const testInputThree = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

const testInputFour = `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`;

const testInputFive = `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`;

Deno.test("day 12", () => {
	assertEquals(solve(testInputOne), 80);
	assertEquals(solve(testInputTwo), 436);
	assertEquals(solve(testInputThree), 1206);
	assertEquals(solve(testInputFour), 236);
	assertEquals(solve(testInputFive), 368);
});
