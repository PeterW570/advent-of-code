import { assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts';

import { decToSnafu, parseSnafuString, snafuToDec } from './common.ts';

// 1              1
// 2              2
// 3             1=
// 4             1-
// 5             10
// 6             11
// 7             12
// 8             2=
// 9             2-
// 10             20
// 15            1=0
// 20            1-0
// 2022         1=11-2
// 12345        1-0---0
// 314159265  1121-1110-1=0

const testInputs = [
	{ dec: 1, snafu: "1" },
	{ dec: 2, snafu: "2" },
	{ dec: 3, snafu: "1=" },
	{ dec: 4, snafu: "1-" },
	{ dec: 5, snafu: "10" },
	{ dec: 6, snafu: "11" },
	{ dec: 7, snafu: "12" },
	{ dec: 8, snafu: "2=" },
	{ dec: 9, snafu: "2-" },
	{ dec: 10, snafu: "20" },
	{ dec: 15, snafu: "1=0" },
	{ dec: 20, snafu: "1-0" },
	{ dec: 2022, snafu: "1=11-2" },
	{ dec: 12345, snafu: "1-0---0" },
	{ dec: 314159265, snafu: "1121-1110-1=0" },
];

Deno.test("Parse snafu string", () => {
	assertEquals(parseSnafuString("210-="), [2, 1, 0, "-", "="]);
});

for (const testInput of testInputs) {
	Deno.test(`${testInput.snafu} (Snafu -> Dec)`, () => {
		assertEquals(snafuToDec(parseSnafuString(testInput.snafu)), testInput.dec);
	});

	Deno.test(`${testInput.dec} (Dec -> Sanfu)`, () => {
		assertEquals(decToSnafu(testInput.dec), parseSnafuString(testInput.snafu));
	});
}
