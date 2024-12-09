export function convertMapToBlocks(diskMap: string): [string[], number] {
	let id = 0;
	const blocks = [];

	for (let idx = 0; idx < diskMap.length; idx++) {
		const isFile = idx % 2 === 0;
		const size = parseInt(diskMap[idx]);
		for (let i = 0; i < size; i++) {
			if (isFile) {
				// file
				blocks.push(`${id}`);
			} else {
				// free space
				blocks.push(".");
			}
		}
		if (isFile) id++;
	}

	return [blocks, id - 1];
}

const findFreeSpace = (blocks: string[], size: number) => {
	let consecFree = 0;
	for (let i = 0; i < blocks.length; i++) {
		if (blocks[i] === ".") consecFree++;
		else consecFree = 0;

		if (consecFree === size) return i - consecFree + 1;
	}
	return -1;
};

export function compact(blocks: string[], maxId: number) {
	let currentIdToMove = maxId;
	while (currentIdToMove >= 0) {
		const toMove = blocks.indexOf(String(currentIdToMove));
		if (toMove < 0) {
			currentIdToMove--;
			continue;
		}
		const blockSize = blocks.slice(toMove).filter((x) => x === String(currentIdToMove)).length;
		const firstFree = findFreeSpace(blocks, blockSize);

		if (firstFree === -1) {
			currentIdToMove--;
			continue;
		}

		if (toMove > -1 && firstFree < toMove) {
			for (let i = 0; i < blockSize; i++) {
				blocks.splice(firstFree + i, 1, `${currentIdToMove}`);
				blocks.splice(toMove + i, 1, ".");
			}
		} else {
			currentIdToMove--;
		}
	}
	return blocks;
}

export function solve(input: string): number {
	const [blocks, maxId] = convertMapToBlocks(input);
	const compacted = compact(blocks, maxId);

	let checksum = 0;
	for (let i = 0; i < compacted.length; i++) {
		if (compacted[i] === ".") continue;
		const val = parseInt(compacted[i]);
		checksum += val * i;
	}

	return checksum;
}
