const input = await Deno.readTextFile("input.txt");

const substringIsUnique = (str: string, from: number, count: number) =>
	(new Set(str.slice(from, from + count))).size === count;

let pos = 14;

while (pos <= input.length && !substringIsUnique(input, pos - 14, 14)) {
	pos++;
}

console.log(pos);
