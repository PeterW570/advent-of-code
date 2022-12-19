import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

interface Blueprint {
	id: number;
	oreRobotOreCost: number;
	clayRobotOreCost: number;
	obsidianRobotOreCost: number;
	obsidianRobotClayCost: number;
	geodeRobotOreCost: number;
	geodeRobotObsidianCost: number;
}

const blueprints: Blueprint[] = [];

for (const line of lines) {
	const match = line.match(/Blueprint (?<blueprintNum>\d+): Each ore robot costs (?<oreRobotOreCost>\d+) ore. Each clay robot costs (?<clayRobotOreCost>\d+) ore. Each obsidian robot costs (?<obsidianRobotOreCost>\d+) ore and (?<obsidianRobotClayCost>\d+) clay. Each geode robot costs (?<geodeRobotOreCost>\d+) ore and (?<geodeRobotObsidianCost>\d+) obsidian./);
	if (!match?.groups) throw new Error("Couldn't parse blueprint");
	const {
		blueprintNum,
		oreRobotOreCost,
		clayRobotOreCost,
		obsidianRobotOreCost,
		obsidianRobotClayCost,
		geodeRobotOreCost,
		geodeRobotObsidianCost,
	} = match.groups;

	blueprints.push({
		id: Number(blueprintNum),
		oreRobotOreCost: Number(oreRobotOreCost),
		clayRobotOreCost: Number(clayRobotOreCost),
		obsidianRobotOreCost: Number(obsidianRobotOreCost),
		obsidianRobotClayCost: Number(obsidianRobotClayCost),
		geodeRobotOreCost: Number(geodeRobotOreCost),
		geodeRobotObsidianCost: Number(geodeRobotObsidianCost),
	});
}

// console.log(blueprints);

const ROCK_TYPES = [
	"ore",
	"clay",
	"obsidian",
	"geode",
] as const;
type RockType = typeof ROCK_TYPES[number];
type CountsByRockType = Record<RockType, number>;

const START_ROBOT_COUNTS: CountsByRockType = {
	ore: 1,
	clay: 0,
	obsidian: 0,
	geode: 0,
};
const START_INVENTORY: CountsByRockType = {
	ore: 0,
	clay: 0,
	obsidian: 0,
	geode: 0,
};
const START_MINUTES = 24;

function collectMaterials(robots: CountsByRockType, inventory: CountsByRockType) {
	for (const rockType of ROCK_TYPES) {
		const robotCount = robots[rockType];
		inventory[rockType] += robotCount;
	}
}

const canBuildGeodeRobot = (blueprint: Blueprint, inventory: CountsByRockType) =>
	inventory.ore >= blueprint.geodeRobotOreCost && inventory.obsidian >= blueprint.geodeRobotObsidianCost;
// const roundsUntilCanBuyGeodeRobot = (blueprint: Blueprint, inventory: CountsByRockType, robots: CountsByRockType) =>
// 	Math.max(0, Math.min(
// 		Math.ceil((blueprint.geodeRobotOreCost - inventory.ore) / robots.ore),
// 		Math.ceil((blueprint.geodeRobotObsidianCost - inventory.obsidian) / robots.obsidian),
// 	));

function buildGeodeRobot(blueprint: Blueprint, inventory: CountsByRockType) {
	if (!canBuildGeodeRobot(blueprint, inventory)) return false;

	inventory.ore -= blueprint.geodeRobotOreCost;
	inventory.obsidian -= blueprint.geodeRobotObsidianCost;

	return true;
}

const canBuildObsidianRobot = (blueprint: Blueprint, inventory: CountsByRockType) =>
	inventory.ore >= blueprint.obsidianRobotOreCost && inventory.clay >= blueprint.obsidianRobotClayCost;
// const roundsUntilCanBuyObsidianRobot = (blueprint: Blueprint, inventory: CountsByRockType, robots: CountsByRockType) =>
// 	Math.max(0, Math.min(
// 		Math.ceil((blueprint.obsidianRobotOreCost - inventory.ore) / robots.ore),
// 		Math.ceil((blueprint.obsidianRobotClayCost - inventory.obsidian) / robots.obsidian),
// 	));

function buildObsidianRobot(blueprint: Blueprint, inventory: CountsByRockType) {
	if (!canBuildObsidianRobot(blueprint, inventory)) return false;

	inventory.ore -= blueprint.obsidianRobotOreCost;
	inventory.clay -= blueprint.obsidianRobotClayCost;

	return true;
}

const canBuildClayRobot = (blueprint: Blueprint, inventory: CountsByRockType) => inventory.ore >= blueprint.clayRobotOreCost;
// const roundsUntilCanBuyClayRobot = (blueprint: Blueprint, inventory: CountsByRockType, robots: CountsByRockType) =>
// 	Math.max(0, Math.ceil((blueprint.clayRobotOreCost - inventory.ore) / robots.ore));

function buildClayRobot(blueprint: Blueprint, inventory: CountsByRockType) {
	if (!canBuildClayRobot(blueprint, inventory)) return false;
	inventory.ore -= blueprint.clayRobotOreCost;
	return true;
}

const canBuildOreRobot = (blueprint: Blueprint, inventory: CountsByRockType) => inventory.ore >= blueprint.oreRobotOreCost;

function buildOreRobot(blueprint: Blueprint, inventory: CountsByRockType) {
	if (!canBuildOreRobot(blueprint, inventory)) return false;
	inventory.ore -= blueprint.oreRobotOreCost;
	return true;
}

function getPathScore(robots: CountsByRockType, inventory: CountsByRockType) {
	return inventory.geode * 1_000_000
		+ robots.geode * 1_000_000
		+ robots.obsidian * 10_000
		+ robots.clay * 100
		+ robots.ore * 1;
}

let qualitySum = 0;
for (const blueprint of blueprints) {
	let minutesRemaining = START_MINUTES;
	let possiblePaths = [{
		robots: Object.assign({}, START_ROBOT_COUNTS),
		inventory: Object.assign({}, START_INVENTORY),
	}];

	while (minutesRemaining > 0) {
		const currentPathCount = possiblePaths.length;
		for (let i = 0; i < currentPathCount; i++) {
			const { robots, inventory } = possiblePaths[i];

			if (canBuildGeodeRobot(blueprint, inventory)) {
				const robotsClone = Object.assign({}, robots);
				const inventoryClone = Object.assign({}, inventory);

				buildGeodeRobot(blueprint, inventoryClone);
				collectMaterials(robotsClone, inventoryClone);

				robotsClone.geode++;

				possiblePaths.push({ robots: robotsClone, inventory: inventoryClone });
			}

			if (canBuildObsidianRobot(blueprint, inventory)) {
				const robotsClone = Object.assign({}, robots);
				const inventoryClone = Object.assign({}, inventory);

				buildObsidianRobot(blueprint, inventoryClone);
				collectMaterials(robotsClone, inventoryClone);

				robotsClone.obsidian++;

				possiblePaths.push({ robots: robotsClone, inventory: inventoryClone });
			}

			if (canBuildClayRobot(blueprint, inventory)) {
				const robotsClone = Object.assign({}, robots);
				const inventoryClone = Object.assign({}, inventory);

				buildClayRobot(blueprint, inventoryClone);
				collectMaterials(robotsClone, inventoryClone);

				robotsClone.clay++;

				possiblePaths.push({ robots: robotsClone, inventory: inventoryClone });
			}

			if (canBuildOreRobot(blueprint, inventory)) {
				const robotsClone = Object.assign({}, robots);
				const inventoryClone = Object.assign({}, inventory);

				buildOreRobot(blueprint, inventoryClone);
				collectMaterials(robotsClone, inventoryClone);

				robotsClone.ore++;

				possiblePaths.push({ robots: robotsClone, inventory: inventoryClone });
			}

			collectMaterials(robots, inventory);
		}

		minutesRemaining--;

		possiblePaths = possiblePaths
			.sort((a, b) => getPathScore(a.robots, a.inventory) > getPathScore(b.robots, b.inventory) ? -1 : 1)
			.slice(0, 100_000);
	}

	let maxGeodes = 0;
	for (const path of possiblePaths) {
		maxGeodes = Math.max(maxGeodes, path.inventory.geode);
	}
	const qualityLevel = blueprint.id * maxGeodes;
	console.log(`Blueprint ${blueprint.id} / ${blueprints.length}: ${qualityLevel} (${maxGeodes} geodes)`);
	qualitySum += qualityLevel;
}

console.log(qualitySum);
