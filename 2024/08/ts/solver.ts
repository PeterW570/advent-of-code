type Pos = { row: number; col: number };
type PosDelta = { dRow: number; dCol: number };

function isInBounds(pos: Pos, rows: number, cols: number) {
	return pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols;
}

function getOffset(posA: Pos, posB: Pos): PosDelta {
	return {
		dRow: posB.row - posA.row,
		dCol: posB.col - posA.col,
	};
}

export function solve(input: string): number {
	const lines = input.split("\n");
	const rows = lines.length;
	const cols = lines[0].length;

	const antennaGroups: Record<string, Pos[]> = {};
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = lines[row][col];
			if (cell === ".") continue;
			else if (antennaGroups[cell]) antennaGroups[cell].push({ row, col });
			else antennaGroups[cell] = [{ row, col }];
		}
	}

	const antinodeCoords = new Set<string>();
	for (const group of Object.values(antennaGroups)) {
		for (let i = 0; i < group.length - 1; i++) {
			for (let j = i + 1; j < group.length; j++) {
				const antennaA = group[i];
				const antennaB = group[j];

				const aToBDelta = getOffset(antennaA, antennaB);

				let antinode: Pos = {
					row: antennaA.row,
					col: antennaA.col,
				};
				while (isInBounds(antinode, rows, cols)) {
					antinodeCoords.add(`${antinode.row},${antinode.col}`);
					antinode.row -= aToBDelta.dRow;
					antinode.col -= aToBDelta.dCol;
				}

				antinode = {
					row: antennaB.row,
					col: antennaB.col,
				};
				while (isInBounds(antinode, rows, cols)) {
					antinodeCoords.add(`${antinode.row},${antinode.col}`);
					antinode.row += aToBDelta.dRow;
					antinode.col += aToBDelta.dCol;
				}
			}
		}
	}

	return antinodeCoords.size;
}
