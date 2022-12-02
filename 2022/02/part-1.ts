import {
    getResultScore, OpponentShape, scoreForShape, Shape, validateTheirInput
} from './common.ts';

const input = await Deno.readTextFile("input.txt");
const lines = input.split("\n");

const OurShape = {
    X: Shape.Rock,
    Y: Shape.Paper,
    Z: Shape.Scissors,
} as const;

const validateOurInput = (raw: string): raw is keyof typeof OurShape => Object.keys(OurShape).includes(raw);

let total = 0;
for (const line of lines) {
    const [themRaw, usRaw] = line.split(" ");
    if (!validateTheirInput(themRaw) || !validateOurInput(usRaw)) {
        throw new Error("Unexpected input");
    }

    const them = OpponentShape[themRaw];
    const us = OurShape[usRaw];

    const resultScore = getResultScore(us, them);
    const playScore = scoreForShape(us);
    total += resultScore + playScore;
}

console.log(total);