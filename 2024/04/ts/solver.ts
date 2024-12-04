type Dir = 1 | 0 | -1;

export function solve(input: string): number {
	let lines = input.split("\n");
	const rows = lines.length;
	const cols = lines[0].length;

	const buildLine = (row: number, col: number, rowDir: Dir, colDir: Dir) => {
		let diagonal = "";
		while (row >= 0 && col >= 0 && row < rows && col < cols) {
			diagonal += lines[row][col];

			row += rowDir;
			col += colDir;
		}
		return diagonal;
	};

	for (let col = 0; col < cols; col++) {
		lines.push(buildLine(0, col, 1, 0));
		lines.push(buildLine(0, col, 1, 1));
		lines.push(buildLine(0, col, 1, -1));
	}
	for (let row = 1; row < rows; row++) {
		lines.push(buildLine(row, 0, 1, 1));
		lines.push(buildLine(row, cols - 1, 1, -1));
	}

	lines = lines.filter((x) => x.length >= 4);

	return lines.reduce(
		(count, line) =>
			count +
			Array.from(line.matchAll(/XMAS/g)).length +
			Array.from(line.matchAll(/SAMX/g)).length,
		0
	);
}
