export enum Shape {
	Rock,
	Paper,
	Scissors
}

export const OpponentShape = {
	A: Shape.Rock,
	B: Shape.Paper,
	C: Shape.Scissors,
} as const;

export const validateTheirInput = (raw: string): raw is keyof typeof OpponentShape => Object.keys(OpponentShape).includes(raw);

export function scoreForShape(shape: Shape) {
	switch (shape) {
		case Shape.Rock: return 1;
		case Shape.Paper: return 2;
		case Shape.Scissors: return 3;
	}
}

export function shapeBeats(shape: Shape) {
	switch (shape) {
		case Shape.Rock: return Shape.Scissors;
		case Shape.Paper: return Shape.Rock;
		case Shape.Scissors: return Shape.Paper;
	}
}

export function shapeLosesTo(shape: Shape) {
	switch (shape) {
		case Shape.Rock: return Shape.Paper;
		case Shape.Paper: return Shape.Scissors;
		case Shape.Scissors: return Shape.Rock;
	}
}

export function getResultScore(ourPlay: Shape, theirPlay: Shape) {
	if (ourPlay === theirPlay) {
		return 3; // draw
	} else if (theirPlay === shapeBeats(ourPlay)) {
		return 6; // win
	} else {
		return 0; // loss
	}
}
