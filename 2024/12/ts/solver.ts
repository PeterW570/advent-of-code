interface Pos {
	row: number;
	col: number;
}

const dirs = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0],
];

interface GroupChild {
	pos: Pos;
	neighbours: number;
}

interface Group {
	childrenPosSet: Set<string>;
	children: GroupChild[];
}

function getGroupBounds(group: Group) {
	let minRow = Infinity;
	let minCol = Infinity;
	let maxRow = -1;
	let maxCol = -1;

	for (const child of group.children) {
		if (child.pos.row < minRow) minRow = child.pos.row;
		if (child.pos.col < minCol) minCol = child.pos.col;
		if (child.pos.row > maxRow) maxRow = child.pos.row;
		if (child.pos.col > maxCol) maxCol = child.pos.col;
	}

	return { minRow, minCol, maxRow, maxCol };
}

function calculateGroupCost(group: Group) {
	const bounds = getGroupBounds(group);

	let perimeter = 0;
	for (let row = bounds.minRow; row <= bounds.maxRow; row++) {
		for (let col = bounds.minCol; col <= bounds.maxCol; col++) {
			if (!group.childrenPosSet.has(`${row},${col}`)) continue;

			const hasNeighbourUp = group.childrenPosSet.has(`${row - 1},${col}`);
			const hasNeighbourRight = group.childrenPosSet.has(`${row},${col + 1}`);
			const hasNeighbourDownRight = group.childrenPosSet.has(`${row + 1},${col + 1}`);
			const hasNeighbourDown = group.childrenPosSet.has(`${row + 1},${col}`);
			const hasNeighbourLeft = group.childrenPosSet.has(`${row},${col - 1}`);
			const hasNeighbourUpLeft = group.childrenPosSet.has(`${row - 1},${col - 1}`);

			// example:
			// [ ]
			// [ ][ ][ ]
			// [ ]   [ ][ ]

			// tops that count:
			// [x]
			// [ ][x][ ]
			// [ ]   [ ][x]
			// count tops where none above, and doesn't have neighbour to the left with open top
			if (!hasNeighbourUp && (hasNeighbourUpLeft || !hasNeighbourLeft)) perimeter++;

			// rights that count:
			// [x]
			// [ ][ ][x]
			// [x]   [ ][x]
			// count rights where none to right, and doesn't have neighbour below with open right
			if (!hasNeighbourRight && (hasNeighbourDownRight || !hasNeighbourDown)) perimeter++;

			// bottoms that count:
			// [ ]
			// [ ][x][ ]
			// [x]   [ ][x]
			// count bottoms where none below, and doesn't have neighbour to the right with open bottom
			if (!hasNeighbourDown && (hasNeighbourDownRight || !hasNeighbourRight)) perimeter++;

			// lefts that count:
			// [x]
			// [ ][ ][ ]
			// [ ]   [x][ ]
			// count lefts where none to left, and doesn't have neighbour above with open left
			if (!hasNeighbourLeft && (hasNeighbourUpLeft || !hasNeighbourUp)) perimeter++;
		}
	}

	const area = group.children.length;
	return area * perimeter;
}

export function solve(input: string): number {
	const lines = input.split("\n");
	const rows = lines.length;
	const cols = lines[0].length;

	const groups: Map<string, Group> = new Map();

	const addedToGroups = new Set<string>();

	function exploreGroup(groupKey: string, currentPosition: Pos) {
		if (
			currentPosition.row < 0 ||
			currentPosition.row >= rows ||
			currentPosition.col < 0 ||
			currentPosition.col >= cols
		) {
			return false;
		}
		const groupLetter = groupKey.split(":")[0];
		const group = groups.get(groupKey);
		if (!group) throw new Error("group not set");

		const cell = lines[currentPosition.row][currentPosition.col];
		if (cell !== groupLetter) return false;
		else if (group.childrenPosSet.has(`${currentPosition.row},${currentPosition.col}`)) {
			return true;
		}

		group.childrenPosSet.add(`${currentPosition.row},${currentPosition.col}`);
		addedToGroups.add(`${currentPosition.row},${currentPosition.col}`);

		const groupMember = {
			pos: currentPosition,
			neighbours: 0,
		};
		group.children.push(groupMember);

		for (const dir of dirs) {
			const isNeighbour = exploreGroup(groupKey, {
				row: currentPosition.row + dir[0],
				col: currentPosition.col + dir[1],
			});
			if (isNeighbour) groupMember.neighbours++;
		}

		return true;
	}

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (addedToGroups.has(`${row},${col}`)) continue;
			const cell = lines[row][col];
			groups.set(`${cell}:${row},${col}`, {
				childrenPosSet: new Set(),
				children: [],
			});
			exploreGroup(`${cell}:${row},${col}`, { row, col });
		}
	}

	let totalCost = 0;
	for (const group of groups.values()) {
		totalCost += calculateGroupCost(group);
	}

	return totalCost;
}
