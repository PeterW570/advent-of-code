function move(arr: number[], matchIdx: number, moveBy: number) {
	const toMove = arr[matchIdx];
	arr.splice(matchIdx, 1);
	arr.splice((matchIdx + moveBy) % arr.length, 0, toMove);
}

const START_ARRAY = [1, 2, 3, 4];

function test(index: number, moveBy: number, expectedIndex: number) {
	const arr = START_ARRAY.slice();
	const val = arr[index];

	move(arr, index, moveBy);

	const actualIdx = arr.findIndex(x => x === val);
	const pass = actualIdx === expectedIndex;

	let toLog = `${pass ? "✓" : "✗"} ${index} move ${moveBy} -> ${expectedIndex}`;
	if (!pass) toLog += ` (Actual: ${actualIdx})`;
	console.log(toLog);
	if (!pass) console.log(arr);
}

// move first item positive direction
test(0, 1, 1);
test(0, 2, 2);
test(0, 3, 0);
test(0, 4, 1);
test(0, 5, 2);
test(0, 8, 2);

// move last item negative direction
test(3, -1, 2);
test(3, -2, 1);
test(3, -3, 0);
test(3, -4, 2);
test(3, -5, 1);
test(3, -8, 1);

// move each item forward one
test(0, 1, 1);
test(1, 1, 2);
test(2, 1, 0);
test(3, 1, 1);

// move each item backwards one
test(0, -1, 2);
test(1, -1, 0);
test(2, -1, 1);
test(3, -1, 2);
