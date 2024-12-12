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

Deno.test("day 11", () => {
	assertEquals(solve(testInputOne), 140);
	assertEquals(solve(testInputTwo), 772);
	assertEquals(solve(testInputThree), 1930);
});
