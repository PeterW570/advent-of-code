interface ButtonSet {
	buttonA: Coords;
	buttonB: Coords;
	prize: Coords;
}

interface Coords {
	x: number;
	y: number;
}

export function getCost({ buttonA, buttonB, prize }: ButtonSet) {
	// A*a_x + B*B_x = p_x
	// A*a_y + B*b_y = p_y

	// Cramer's rule, thanks [reddit](https://www.reddit.com/r/adventofcode/comments/1hd7irq/2024_day_13_an_explanation_of_the_mathematics/)
	// A = (p_x*b_y - prize_y*b_x) / (a_x*b_y - a_y*b_x)
	// B = (a_x*p_y - a_y*p_x) / (a_x*b_y - a_y*b_x)

	const det = buttonA.x * buttonB.y - buttonA.y * buttonB.x;
	const buttonAPresses = (prize.x * buttonB.y - prize.y * buttonB.x) / det;
	const buttonBPresses = (buttonA.x * prize.y - buttonA.y * prize.x) / det;

	if (!Number.isInteger(buttonAPresses) || !Number.isInteger(buttonBPresses)) {
		return 0;
	}

	return buttonAPresses * 3 + buttonBPresses;
}

export function solve(input: string): number {
	const buttonSets: ButtonSet[] = [];

	const buttonAMatches = Array.from(input.matchAll(/Button A: X\+(\d+), Y\+(\d+)/gm));
	const buttonBMatches = Array.from(input.matchAll(/Button B: X\+(\d+), Y\+(\d+)/gm));
	const prizeMatches = Array.from(input.matchAll(/Prize: X=(\d+), Y=(\d+)/gm));

	for (let i = 0; i < buttonAMatches.length; i++) {
		buttonSets.push({
			buttonA: {
				x: parseInt(buttonAMatches[i][1]),
				y: parseInt(buttonAMatches[i][2]),
			},
			buttonB: {
				x: parseInt(buttonBMatches[i][1]),
				y: parseInt(buttonBMatches[i][2]),
			},
			prize: {
				x: parseInt(prizeMatches[i][1]) + 10000000000000,
				y: parseInt(prizeMatches[i][2]) + 10000000000000,
			},
		});
	}

	return buttonSets.reduce((total, x) => total + getCost(x), 0);
}
