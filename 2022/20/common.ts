export function move<T>(arr: T[], matchIdx: number, moveBy: number) {
	const toMove = arr.splice(matchIdx, 1)[0];
	arr.splice((matchIdx + moveBy) % arr.length, 0, toMove);
}
