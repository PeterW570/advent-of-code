const input = await Deno.readTextFile("input.txt");
const lines = input.split("\n");

const pointWithinRangeInclusive = (point: number, rangeMin: number, rangeMax: number) => point >= rangeMin && point <= rangeMax;

const rangesOverlap = ([xMin, xMax]: number[], [yMin, yMax]: number[]) =>
	pointWithinRangeInclusive(xMin, yMin, yMax)
	|| pointWithinRangeInclusive(xMax, yMin, yMax)
	|| pointWithinRangeInclusive(yMin, xMin, xMax)
	|| pointWithinRangeInclusive(yMax, xMin, xMax);

let total = 0;
for (const line of lines) {
	const [elfOne, elfTwo] = line.split(",");
	const elfOneRange = elfOne.split("-").map(str => Number(str));
	const elfTwoRange = elfTwo.split("-").map(str => Number(str));

	if (rangesOverlap(elfOneRange, elfTwoRange)) {
		total++;
	}
}
console.log(total);
