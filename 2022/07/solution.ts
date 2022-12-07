import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

enum CommandType {
	List,
	MoveUp,
	MoveIn
}

enum ListItemType {
	Dir,
	File,
}

const isCommand = (input: string) => input.startsWith("$");

function getCommandType(input: string) {
	const withoutStart = input.slice(1).trim();
	if (withoutStart === "ls") {
		return CommandType.List;
	} else if (withoutStart === "cd ..") {
		return CommandType.MoveUp;
	} else {
		return CommandType.MoveIn;
	}
}

const getDirToMoveInto = (input: string) => input.match(/^\$ cd (?<dir>\w+)$/)?.groups?.dir;

const getListItemType = (input: string) => input.startsWith("dir ") ? ListItemType.Dir : ListItemType.File;

const getDirName = (input: string) => input.slice("dir ".length);
function getFileInfo(input: string) {
	const match = input.match(/^(?<size>\d+) (?<name>[\w\.]+?)$/);
	if (!match?.groups) throw new Error("Groups not parsed");
	const { name, size } = match.groups;
	return { name, size: Number(size) };
}

interface DirEntry {
	[name: string]: number | DirEntry;
}
type DirType = Partial<DirEntry>;
const fileTree: DirType = {};
let currentDir: DirType = fileTree;
const currentPath: string[] = [];

const getDirAtPath = (path: string[]) => path.length === 0 ? fileTree
	: path.reduce((dir, name) => {
		const entry = dir[name];
		if (entry === undefined) throw new Error("Expected dir not found");
		else if (typeof entry === "number") throw new Error("File found rather than dir");
		return entry;
	}, fileTree);

for (const line of lines.slice(1)) {
	if (isCommand(line)) {
		const commandType = getCommandType(line);
		if (commandType === CommandType.MoveUp) {
			currentPath.pop();
			const newDir = getDirAtPath(currentPath);
			if (typeof newDir === "number") throw new Error("Trying to move into file");
			currentDir = newDir;
			if (currentDir === undefined) throw new Error("Couldn't find dir");
		} else if (commandType === CommandType.MoveIn) {
			const dirName = getDirToMoveInto(line);
			if (dirName === undefined) throw new Error("Couldn't find dir name to move into");
			currentPath.push(dirName);
			const newDir = currentDir[dirName];
			if (typeof newDir === "number") throw new Error("Trying to move into file");
			if (newDir === undefined) throw new Error("Couldn't find dir");
			currentDir = newDir;
		}
	} else { // if not a command, must be listing files/dirs
		const itemType = getListItemType(line);
		if (itemType === ListItemType.Dir) {
			const dirName = getDirName(line);
			if (!(dirName in currentDir)) {
				currentDir[dirName] = {};
			}
		} else {
			const { name, size } = getFileInfo(line);
			currentDir[name] = size;
		}
	}
}

const dirSizes: number[] = [];

function calculateDirSize(tree: DirType) {
	let dirSize = 0;
	for (const fileOrDirName in tree) {
		const item = tree[fileOrDirName];
		if (typeof item === "number") {
			dirSize += item;
		} else {
			dirSize += calculateDirSize(item!);
		}
	}
	dirSizes.push(dirSize);
	return dirSize;
}
calculateDirSize(fileTree);

const sortedSizes = dirSizes.sort((a, b) => b - a);
const p1Solution = sortedSizes.filter(size => size <= 100000).reduce((sum, curr) => sum + curr, 0);

console.log(p1Solution);

const maxFilesystem = 70000000;
const requiredFreeSpace = 30000000;

const totalUsed = sortedSizes[0];
const toFree = requiredFreeSpace - (maxFilesystem - totalUsed);

const p2Solution = sortedSizes.reverse().find(size => size >= toFree)

console.log(p2Solution);

// console.log(fileTree);
