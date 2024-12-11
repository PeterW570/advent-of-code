const cache: Map<
	number,
	{
		next: number[];
		countsAfterIterations: Map<number, number>;
	}
> = new Map();

const splitNum = (num: number) => {
	const strNum = `${num}`;
	if (strNum.length % 2 === 1) throw new Error("Can't split");
	else {
		return [
			parseInt(strNum.slice(0, strNum.length / 2)),
			parseInt(strNum.slice(strNum.length / 2)),
		];
	}
};

export function getCountAfterIterations(entries: number[], remainingIterations: number): number {
	if (remainingIterations === 0) {
		return entries.length;
	}
	let total = 0;

	for (const entry of entries) {
		const cached = cache.get(entry);
		if (cached) {
			const cachedCount = cached.countsAfterIterations.get(remainingIterations);
			if (cachedCount) {
				total += cachedCount;
			} else {
				const counts = getCountAfterIterations(cached.next, remainingIterations - 1);
				cached.countsAfterIterations.set(remainingIterations, counts);
				total += counts;
			}
		} else {
			let next: number[];
			if (entry === 0) {
				next = [1];
			} else if (`${entry}`.length % 2 === 0) {
				next = splitNum(entry);
			} else {
				next = [entry * 2024];
			}
			cache.set(entry, {
				next,
				countsAfterIterations: new Map(),
			});
			const counts = getCountAfterIterations(next, remainingIterations - 1);
			cache.get(entry)!.countsAfterIterations.set(remainingIterations, counts);
			total += counts;
		}
	}

	return total;
}

export function solve(input: string): number {
	return getCountAfterIterations(input.split(" ").map(Number), 75);
}
