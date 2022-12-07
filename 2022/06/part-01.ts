const input = await Deno.readTextFile("input.txt");

let pos = 4;

while (pos <= input.length && (new Set(input.slice(pos - 4, pos)).size !== 4)) {
	pos++;
}

console.log(pos);
