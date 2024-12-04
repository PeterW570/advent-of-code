type Dir = 1 | 0 | -1;

export function solve(input: string): number {
	let count = 0;

	const lines = input.split("\n");
	const rows = lines.length;
	const cols = lines[0].length;

	for (let row = 1; row < rows - 1; row++) {
		for (let col = 1; col < cols - 1; col++) {
			const cell = lines[row][col];
			if (cell !== "A") continue;

			const diagonalOne = lines[row - 1][col - 1] + lines[row + 1][col + 1];
			const diagonalTwo = lines[row - 1][col + 1] + lines[row + 1][col - 1];

			if (diagonalOne.match(/SM|MS/) && diagonalTwo.match(/SM|MS/)) count++;
		}
	}

	return count;
}
