const input = await Deno.readTextFile("input.txt");
const lines = input.split("\n");

const getPriority = (letter: string) =>
	letter.charCodeAt(0) - (letter === letter.toLowerCase() ? (97 - 1) : (65 - 27))

let total = 0;
for (const line of lines) {
	const firstCompartment = line.slice(0, line.length / 2);
	const secondCompartment = line.slice(line.length / 2);

	const commonItem = firstCompartment.split("").find(x => secondCompartment.includes(x));

	if (!commonItem) {
		throw new Error("Couldn't find common item for compartments");
	}

	const priority = getPriority(commonItem);
	total += priority;
}

console.log(total);
