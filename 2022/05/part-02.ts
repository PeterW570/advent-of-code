const stacks = await Deno.readTextFile("starting-stacks.txt");
const instructions = await Deno.readTextFile("instructions.txt");
const stackRows = stacks.split("\n");
const instructionRow = instructions.split("\n");

const columnIndexRow = stackRows.at(-1);
if (!columnIndexRow) {
	throw new Error("Failed to find column index row");
}
const columnToLocation: Record<string, number> = {};
const columnStacks: Record<string, string[]> = {};
for (let i = 0; i < columnIndexRow.length; i++) {
	const char = columnIndexRow[i];
	if (char !== " ") {
		columnToLocation[char] = i;
		columnStacks[char] = [];
	}
}

for (const stackRow of stackRows.slice(0, -1).reverse()) {
	for (let col = 1; col <= 9; col++) {
		const entry = stackRow[columnToLocation[col]];
		if (entry.match("[A-Z]")) {
			columnStacks[col].push(entry);
		}
	}
}

for (const instruction of instructionRow) {
	const [/* move */, countStr, /* from */, from, /* to */, to] = instruction.split(" ");
	const count = Number(countStr);
	const allToMove: string[] = [];
	for (let i = 0; i < count; i++) {
		const toMove = columnStacks[from].pop();
		if (toMove === undefined) {
			break;
		}
		allToMove.push(toMove);
	}
	columnStacks[to].push(...allToMove.reverse());
}

let solution = "";
for (let col = 1; col <= 9; col++) {
	const top = columnStacks[col].at(-1);
	solution += top;
}
console.log(solution);
