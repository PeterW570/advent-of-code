import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

const grid = lines.map(line => line.split("").map(str => Number(str)));

let bestTreeScore = 0;
for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
	const row = grid[rowIdx];
	for (let colIdx = 0; colIdx < row.length; colIdx++) {
		const tree = row[colIdx];
		
		// check row before
		let visibleTreesRowBefore = 0;
		for (let colToCheckIdx = colIdx - 1; colToCheckIdx >= 0; colToCheckIdx--) {
			const toCheck = row[colToCheckIdx];
			visibleTreesRowBefore++;
			if (toCheck >= tree) break;
		}

		// check row after
		let visibleTreesRowAfter = 0;
		for (let colToCheckIdx = colIdx + 1; colToCheckIdx < row.length; colToCheckIdx++) {
			const toCheck = row[colToCheckIdx];
			visibleTreesRowAfter++;
			if (toCheck >= tree) break;
		}

		// check col before
		let visibleTreesColBefore = 0;
		for (let rowToCheckIdx = rowIdx - 1; rowToCheckIdx >= 0; rowToCheckIdx--) {
			const toCheck = grid[rowToCheckIdx][colIdx];
			visibleTreesColBefore++;
			if (toCheck >= tree) break;
		}

		// check col after
		let visibleTreesColAfter = 0;
		for (let rowToCheckIdx = rowIdx + 1; rowToCheckIdx < grid.length; rowToCheckIdx++) {
			const toCheck = grid[rowToCheckIdx][colIdx];
			visibleTreesColAfter++;
			if (toCheck >= tree) break;
		}

		// console.log(`(${rowIdx}, ${colIdx})`, visibleTreesRowBefore, visibleTreesRowAfter, visibleTreesColBefore, visibleTreesColAfter)
		const visible = visibleTreesRowBefore * visibleTreesRowAfter * visibleTreesColBefore * visibleTreesColAfter;
		bestTreeScore = Math.max(bestTreeScore, visible);
	}
}

console.log(bestTreeScore);
