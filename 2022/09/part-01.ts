const input = await Deno.readTextFile("input.txt");
const lines = input.split("\n");

let [hX, hY] = [0, 0];
let [tX, tY] = [0, 0];
const tailPositions = new Set(["0,0"]);

const needsToMove = () => (Math.abs(tX - hX) > 1) || (Math.abs(tY - hY) > 1);

function updateTail() {
	if (!needsToMove()) return;
	else if (hX == tX) tY += (hY > tY) ? 1 : -1;
	else if (hY == tY) tX += (hX > tX) ? 1 : -1;
	else {
		tX += (hX > tX) ? 1 : -1;
		tY += (hY > tY) ? 1 : -1;
	}

	tailPositions.add([tX, tY].join(","));
}

for (const line of lines) {
	const [dir, distStr] = line.split(" ");
	const dist = Number(distStr);
	for (let i = 0; i < dist; i++) {
		switch (dir) {
			case "U":
				hY++;
				break;
			case "D":
				hY--;
				break;
			case "L":
				hX--;
				break;
			case "R":
				hX++;
				break;
			default:
				throw new Error("Unexpected direction");
		}
		updateTail();
	}
}

console.log(tailPositions.size);
