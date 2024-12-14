interface Coords {
	/** corresponds to the column (distance from the left side of area) */
	x: number;
	/** corresponds to the row (distance from the top of area) */
	y: number;
}

interface IRobot {
	position: Coords;
	velocity: Coords;
}

interface Bounds {
	rows: number;
	cols: number;
}

const positiveModulo = (num: number, bound: number) => ((num % bound) + bound) % bound;

function moveRobot(robot: IRobot, bounds: Bounds) {
	robot.position.x = positiveModulo(robot.position.x + robot.velocity.x, bounds.cols);
	robot.position.y = positiveModulo(robot.position.y + robot.velocity.y, bounds.rows);
}

function findSafetyFactor(robots: IRobot[], bounds: Bounds) {
	const robotCountByLocation: Partial<Record<string, number>> = {};
	for (const robot of robots) {
		const coordStr = `${robot.position.y},${robot.position.x}`;
		robotCountByLocation[coordStr] = (robotCountByLocation[coordStr] ?? 0) + 1;
	}

	const quadrantCounts = [0, 0, 0, 0];

	for (let row = 0; row < bounds.rows; row++) {
		for (let col = 0; col < bounds.cols; col++) {
			const isTopHalf = row < Math.floor(bounds.rows / 2);
			const isLeftHalf = col < Math.floor(bounds.cols / 2);
			const isBottomHalf = row >= Math.ceil(bounds.rows / 2);
			const isRightHalf = col >= Math.ceil(bounds.cols / 2);

			const quadrant =
				isTopHalf && isLeftHalf
					? 0
					: isTopHalf && isRightHalf
					? 1
					: isBottomHalf && isLeftHalf
					? 2
					: isBottomHalf && isRightHalf
					? 3
					: null;

			if (quadrant !== null) {
				quadrantCounts[quadrant] += robotCountByLocation[`${row},${col}`] ?? 0;
			}
		}
	}

	return quadrantCounts.reduce((sum, curr) => sum * curr, 1);
}

export function solve(input: string, bounds: Bounds): number {
	const lines = input.split("\n");

	const robots: IRobot[] = [];
	for (const line of lines) {
		const matches = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/);
		if (matches?.length !== 5) throw new Error("Couldn't parse input");
		robots.push({
			position: {
				x: parseInt(matches[1]),
				y: parseInt(matches[2]),
			},
			velocity: {
				x: parseInt(matches[3]),
				y: parseInt(matches[4]),
			},
		});
	}

	for (let i = 0; i < 100; i++) {
		for (const robot of robots) {
			moveRobot(robot, bounds);
		}
	}

	// console.log(debugLocations(robots, bounds));

	return findSafetyFactor(robots, bounds);
}

function debugLocations(robots: IRobot[], bounds: Bounds) {
	const robotCountByLocation: Partial<Record<string, number>> = {};
	for (const robot of robots) {
		const coordStr = `${robot.position.y},${robot.position.x}`;
		robotCountByLocation[coordStr] = (robotCountByLocation[coordStr] ?? 0) + 1;
	}

	for (let row = 0; row < bounds.rows; row++) {
		let line = "";
		for (let col = 0; col < bounds.cols; col++) {
			const robotCount = robotCountByLocation[`${row},${col}`];
			line += robotCount ?? ".";
		}
		console.log(line);
	}
	console.log();
}
