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

export function compact(blocks: string[], maxId: number) {
	let currentIdToMove = maxId;
	while (true) {
		const firstFree = blocks.indexOf(".");
		const lastBlock = blocks.lastIndexOf(String(currentIdToMove));

		if (firstFree === -1) break;

		if (lastBlock > -1 && firstFree < lastBlock) {
			blocks.splice(firstFree, 1, `${currentIdToMove}`);
			blocks.splice(lastBlock, 1, ".");
		} else if (currentIdToMove > 0) {
			currentIdToMove--;
		} else {
			break;
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
