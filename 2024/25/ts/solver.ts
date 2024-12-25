export function parseLock(lockSchematic: string[]) {
	const lock: number[] = [];
	for (let col = 0; col < lockSchematic[0].length; col++) {
		let height = 0;
		for (const row of lockSchematic) {
			const cell = row[col];
			if (cell === ".") break;
			height++;
		}
		lock.push(height - 1);
	}
	return lock;
}

export function parseKey(keySchematic: string[]) {
	const key: number[] = [];
	keySchematic = keySchematic.slice().reverse();
	for (let col = 0; col < keySchematic[0].length; col++) {
		let height = 0;
		for (const row of keySchematic) {
			const cell = row[col];
			if (cell === ".") break;
			height++;
		}
		key.push(height - 1);
	}
	return key;
}

export function solve(input: string): number {
	const schematics = input.split("\n\n").map((x) => x.split("\n"));

	const locks: number[][] = [];
	const keys: number[][] = [];

	for (const schematic of schematics) {
		if (schematic[0].includes("#")) {
			locks.push(parseLock(schematic));
		} else {
			keys.push(parseKey(schematic));
		}
	}

	let validCombinations = 0;

	for (const lock of locks) {
		for (const key of keys) {
			let valid = true;
			for (let i = 0; i < lock.length; i++) {
				if (lock[i] + key[i] > 5) {
					valid = false;
					break;
				}
			}
			if (valid) validCombinations++;
		}
	}

	return validCombinations;
}
