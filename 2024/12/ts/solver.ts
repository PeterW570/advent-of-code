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

function calculateGroupCost(group: Group) {
	const area = group.children.length;
	const perimeter = group.children.reduce((total, child) => total + 4 - child.neighbours, 0);
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
			groups.set(`${cell}:${row},${col}`, { childrenPosSet: new Set(), children: [] });
			exploreGroup(`${cell}:${row},${col}`, { row, col });
		}
	}

	let totalCost = 0;
	for (const group of groups.values()) {
		totalCost += calculateGroupCost(group);
	}

	return totalCost;
}
