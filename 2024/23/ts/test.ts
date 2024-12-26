import { assertEquals } from "jsr:@std/assert";

import { solve } from "./solver.ts";

const testCases = [
	{
		input: `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`,
		expected: "co,de,ka,ta",
	},
];

Deno.test("day 23", () => {
	for (const { input, expected } of testCases) {
		assertEquals(solve(input), expected);
	}
});
