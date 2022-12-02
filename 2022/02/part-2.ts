import {
    getResultScore, OpponentShape, scoreForShape, Shape, shapeBeats, shapeLosesTo,
    validateTheirInput
} from './common.ts';

const input = await Deno.readTextFile("input.txt");
const lines = input.split("\n");

enum GameResult {
    Win,
    Loss,
    Draw
}

const RequiredResult = {
    X: GameResult.Loss,
    Y: GameResult.Draw,
    Z: GameResult.Win,
} as const;

function getRequiredPlay(result: GameResult, theirPlay: Shape) {
    if (result === GameResult.Draw) {
        return theirPlay;
    } else if (result === GameResult.Loss) {
        return shapeBeats(theirPlay);
    } else {
        return shapeLosesTo(theirPlay);
    }
}

const validateResultInput = (raw: string): raw is keyof typeof RequiredResult => Object.keys(RequiredResult).includes(raw);

let total = 0;
for (const line of lines) {
    const [themRaw, resultRaw] = line.split(" ");
    if (!validateTheirInput(themRaw) || !validateResultInput(resultRaw)) {
        throw new Error("Unexpected input");
    }

    const them = OpponentShape[themRaw];
    const result = RequiredResult[resultRaw];
    const us = getRequiredPlay(result, them);

    const resultScore = getResultScore(us, them);
    const playScore = scoreForShape(us);
    total += resultScore + playScore;
}

console.log(total);
