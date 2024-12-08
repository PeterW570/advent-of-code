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

	const antinodes: Pos[] = [];
	for (const group of Object.values(antennaGroups)) {
		for (let i = 0; i < group.length - 1; i++) {
			for (let j = i + 1; j < group.length; j++) {
				const antennaA = group[i];
				const antennaB = group[j];

				const aToBDelta = getOffset(antennaA, antennaB);

				const antiAB: Pos = {
					row: antennaA.row - aToBDelta.dRow,
					col: antennaA.col - aToBDelta.dCol,
				};
				if (isInBounds(antiAB, rows, cols)) {
					antinodes.push(antiAB);
				}

				const antiBA: Pos = {
					row: antennaB.row + aToBDelta.dRow,
					col: antennaB.col + aToBDelta.dCol,
				};
				if (isInBounds(antiBA, rows, cols)) {
					antinodes.push(antiBA);
				}
			}
		}
	}

	return new Set(antinodes.map((x) => `${x.row},${x.col}`)).size;
}
