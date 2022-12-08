import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

const grid = lines.map(line => line.split("").map(str => Number(str)));

let visible = 0;
for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
	const row = grid[rowIdx];
	for (let colIdx = 0; colIdx < row.length; colIdx++) {
		const tree = row[colIdx];
		
		// check row before
		let isVisibleRowBefore = true;
		for (let colToCheckIdx = 0; colToCheckIdx < colIdx; colToCheckIdx++) {
			if (row[colToCheckIdx] >= tree) {
				isVisibleRowBefore = false;
				continue;
			}
		}
		if (isVisibleRowBefore) {
			visible++;
			continue;
		}

		// check row after
		let isVisibleRowAfter = true;
		for (let colToCheckIdx = colIdx + 1; colToCheckIdx < row.length; colToCheckIdx++) {
			if (row[colToCheckIdx] >= tree) {
				isVisibleRowAfter = false;
				continue;
			}
		}
		if (isVisibleRowAfter) {
			visible++;
			continue;
		}

		// check col before
		let isVisibleColBefore = true;
		for (let rowToCheckIdx = 0; rowToCheckIdx < rowIdx; rowToCheckIdx++) {
			if (grid[rowToCheckIdx][colIdx] >= tree) {
				isVisibleColBefore = false;
				continue;
			}
		}
		if (isVisibleColBefore) {
			visible++;
			continue;
		}

		// check col after
		let isVisibleColAfter = true;
		for (let rowToCheckIdx = rowIdx + 1; rowToCheckIdx < grid.length; rowToCheckIdx++) {
			if (grid[rowToCheckIdx][colIdx] >= tree) {
				isVisibleColAfter = false;
				continue;
			}
		}
		if (isVisibleColAfter) {
			visible++;
			continue;
		}
	}
}

console.log(visible);
