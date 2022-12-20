import { assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts';

import { move } from './common.ts';

const START_ARRAY = [1, 2, 3, 4];

function test(index: number, moveBy: number, expected: number[]) {
	Deno.test(`${index} -> ${moveBy > 0 ? `+${moveBy}` : moveBy}`, () => {
		const arr = START_ARRAY.slice();
		move(arr, index, moveBy);
		assertEquals(arr, expected);
	});
}

// move first item positive direction
test(0, 1, [2, 1, 3, 4]);
test(0, 2, [2, 3, 1, 4]);
test(0, 3, [1, 2, 3, 4]);
test(0, 4, [2, 1, 3, 4]);
test(0, 5, [2, 3, 1, 4]);
test(0, 8, [2, 3, 1, 4]);

// move last item negative direction
test(3, -1, [1, 2, 4, 3]);
test(3, -2, [1, 4, 2, 3]);
test(3, -3, [4, 1, 2, 3]);
test(3, -4, [1, 2, 4, 3]);
test(3, -5, [1, 4, 2, 3]);
test(3, -8, [1, 4, 2, 3]);

// move each item forward one
test(0, 1, [2, 1, 3, 4]);
test(1, 1, [1, 3, 2, 4]);
test(2, 1, [3, 1, 2, 4]);
test(3, 1, [1, 4, 2, 3]);

// move each item backwards one
test(0, -1, [2, 3, 1, 4]);
test(1, -1, [2, 1, 3, 4]);
test(2, -1, [1, 3, 2, 4]);
test(3, -1, [1, 2, 4, 3]);
