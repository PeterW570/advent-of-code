import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/posix.ts';

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "./input.txt"));
const lines = input.split("\n");

const ROPE_LENGTH = 10;
let [hX, hY] = [0, 0];
const knots: [number, number][] = [];
for (let i = 1; i < ROPE_LENGTH; i++) {
  knots.push([0, 0]);
}
const tail = knots[knots.length - 1];
const tailPositions = new Set(["0,0"]);

const needsToMove = (knot: [number, number], previous: [number, number]) => (Math.abs(knot[0] - previous[0]) > 1) || (Math.abs(knot[1] - previous[1]) > 1);

function updateTail() {
  let knotIdx = 0;
  let knot = knots[knotIdx];
  let previous: [number, number] = [hX, hY];
  while (knot !== undefined && needsToMove(knot, previous)) {
    if (previous[0] == knot[0]) knot[1] += (previous[1] > knot[1]) ? 1 : -1;
    else if (previous[1] == knot[1]) knot[0] += (previous[0] > knot[0]) ? 1 : -1;
    else {
      knot[0] += (previous[0] > knot[0]) ? 1 : -1;
      knot[1] += (previous[1] > knot[1]) ? 1 : -1;
    }
    previous = knot;
    knot = knots[++knotIdx];
  }

  tailPositions.add(tail.join(","));
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
