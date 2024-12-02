export function solve(input: string): number {
	const lines = input.split("\n");

	let safeReports = 0;
	for (const line of lines) {
		const report = line.split(" ");

		const diffs: number[] = [];
		let isSafe = true;
		for (let i = 1; i < report.length; i++) {
			const prev = parseInt(report[i - 1]);
			const current = parseInt(report[i]);

			if (prev === current) {
				isSafe = false;
				break;
			}

			const diff = current - prev;
			if (Math.abs(diff) > 3) {
				isSafe = false;
				break;
			}

			if (!diffs.length) {
				diffs.push(diff);
				continue;
			}

			const prevDiff = diffs[diffs.length - 1];
			if ((prevDiff > 0 && diff < 0) || (prevDiff < 0 && diff > 0)) {
				isSafe = false;
				break;
			}
		}

		if (isSafe) safeReports++;
	}

	return safeReports;
}
