import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const jets = await Deno.readTextFile(join(_dirname, "./input.txt"));

const SHAPES: string[][] = [
	["####"],
	[
		".#.",
		"###",
		".#."
	],
	[
		"..#",
		"..#",
		"###"
	],
	[
		"#",
		"#",
		"#",
		"#"
	],
	[
		"##",
		"##"
	]
];

interface Coordinates {
	x: number;
	y: number;
}

const CHAMBER_WIDTH = 7;
const START_LEFT_MARGIN = 2;
const START_BOTTOM_MARGIN = 3;
const NUM_SHAPES = SHAPES.length;
const NUM_JETS = jets.length;
const TARGET_ROCKS = 1_000_000_000_000;

const stationaryRocks: boolean[][] = [];

const rowToString = (row: boolean[]) => row.map(cell => cell ? "#" : ".").join("");
const stateToString = () => stationaryRocks.map(rowToString).reverse().join("\n");

const _printCurrentState = () => console.log(stateToString());

const getShapeRockCoordinates = (shape: string[], coords: Coordinates) => {
	// console.log(shape.join("\n"));
	const height = shape.length;
	const toReturn: Coordinates[] = [];
	for (let i = 0; i < height; i++) {
		const row = shape[i];
		for (let j = 0; j < row.length; j++) {
			const cell = row[j];
			if (cell === ".") continue;
			toReturn.push({
				x: coords.x + j,
				y: coords.y + (height - i - 1)
			});
		}
	}

	return toReturn;
};

const shapeCanFall = (shapeCoordinates: Coordinates[]) => {
	for (const coord of shapeCoordinates) {
		if (stationaryRocks.length === 0 && coord.y === 0) {
			return false;
		} else if (stationaryRocks.length <= coord.y - 1) {
			continue;
		} else if (stationaryRocks[coord.y - 1][coord.x]) {
			return false;
		}
	}
	return true;
};

const shapeCanMoveToSide = (shapeCoordinates: Coordinates[], dir: "<" | ">") => {
	for (const coord of shapeCoordinates) {
		if (dir === "<" && coord.x === 0) {
			return false;
		} else if (dir === ">" && coord.x === CHAMBER_WIDTH - 1) {
			return false;
		} else if (stationaryRocks.length <= coord.y) {
			continue;
		} else {
			const next = stationaryRocks[coord.y][coord.x + (dir === ">" ? 1 : -1)];
			if (next) return false;
		}
	}
	return true;
};

const updateStationaryRocks = (shapeCoordinates: Coordinates[]) => {
	for (const coord of shapeCoordinates) {
		while (stationaryRocks.length - 1 < coord.y) {
			const newRow = [];
			for (let i = 0; i < CHAMBER_WIDTH; i++) {
				newRow.push(false);
			}
			stationaryRocks.push(newRow);
		}
		stationaryRocks[coord.y][coord.x] = true;
	}
};

const stateHistory: { shapeIdx: number, jetIdx: number; state: string }[] = [];

function checkForPattern(currentState: string, shapeIdx: number, jetIdx: number) {
	const currentSplit = currentState.split("\n");
	for (let i = stateHistory.length - 1; i >= 0; i--) {
		const toCheck = stateHistory[i];
		if (toCheck.shapeIdx !== shapeIdx || toCheck.jetIdx !== jetIdx) continue;
		const lineDiff = currentSplit.length - toCheck.state.split("\n").length;
		const potentialPattern = currentSplit.slice(0, lineDiff).join("\n");

		if (toCheck.state.startsWith(potentialPattern)) {
			return {
				matchIdx: i,
				patternLength: stateHistory.length - i,
				patternHeight: lineDiff,
			};
		}
	}
	return null;
}

let rocksFallen = 0;
let shapeIdx = 0;
let jetIdx = 0;
let moveType: "Blow" | "Fall" = "Blow"

let height = 0;

while (rocksFallen < TARGET_ROCKS) {
	const shape = SHAPES[shapeIdx];
	shapeIdx = (shapeIdx + 1) % NUM_SHAPES;

	// coords for the bottom left corner of the shape bounding box
	const shapeCoordinates: Coordinates = {
		x: START_LEFT_MARGIN,
		y: stationaryRocks.length + START_BOTTOM_MARGIN,
	};

	let rockIsFalling = true;
	while (rockIsFalling) {
		const shapeRockCoordinates = getShapeRockCoordinates(shape, shapeCoordinates);
		if (moveType === "Blow") {
			const jetDir = jets[jetIdx];
			jetIdx = (jetIdx + 1) % NUM_JETS;

			if (jetDir !== ">" && jetDir !== "<") throw new Error("Invalid jetDir");
			if (shapeCanMoveToSide(shapeRockCoordinates, jetDir)) {
				shapeCoordinates.x += (jetDir === ">" ? 1 : -1);
			}
		} else {
			if (shapeCanFall(shapeRockCoordinates)) {
				shapeCoordinates.y--;
			} else {
				rockIsFalling = false;
				rocksFallen++;
				updateStationaryRocks(shapeRockCoordinates);
			}
		}
		moveType = moveType === "Blow" ? "Fall" : "Blow";
	}

	console.log(`${rocksFallen} / ${TARGET_ROCKS}`);

	const currentState = stateToString();
	const patternFound = checkForPattern(currentState, shapeIdx, jetIdx);

	if (patternFound !== null) {
		const remaining = TARGET_ROCKS - rocksFallen;
		const patternCount = Math.floor(remaining / patternFound.patternLength);

		const heightFromPattern = patternCount * patternFound.patternHeight;
		const extraCount = remaining % patternFound.patternLength;

		let extraHeight = 0;
		if (extraCount > 0) {
			const heightA = stateHistory[patternFound.matchIdx].state.split("\n").length;
			const heightB = stateHistory[patternFound.matchIdx + extraCount].state.split("\n").length;
			extraHeight = heightB - heightA;
		}

		height = stationaryRocks.length + heightFromPattern + extraHeight;
		break;
	}

	stateHistory.push({
		state: currentState,
		shapeIdx,
		jetIdx,
	});

	height = stationaryRocks.length;
}

// Answer for Part 2 - Change TARGET_ROCKS to 2022 for part 1
console.log(height);
