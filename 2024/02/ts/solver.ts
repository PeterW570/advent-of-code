const getDir = (diff: number) => diff / Math.abs(diff);
const diffDirsAreEqual = (diffA: number, diffB: number) =>
	getDir(diffA) === getDir(diffB);

function checkReportSafety(report: string[]): number | null {
	const diffs: number[] = [];
	let unsafeIndex = null;
	for (let i = 1; i < report.length; i++) {
		const prev = parseInt(report[i - 1]);
		const current = parseInt(report[i]);

		const diff = current - prev;
		if (Math.abs(diff) > 3 || diff === 0) {
			unsafeIndex ??= i;
			diffs.push(diff);
		}

		if (!diffs.length) {
			diffs.push(diff);
			continue;
		}

		const prevDiff = diffs[diffs.length - 1];
		if (!diffDirsAreEqual(diff, prevDiff)) {
			unsafeIndex ??= i;
			diffs.push(diff);
		}
	}

	return unsafeIndex;
}

function checkSafetyWithout(report: string[], withoutIdx: number): boolean {
	const toCheck = report.slice();
	toCheck.splice(withoutIdx, 1);
	return checkReportSafety(toCheck) === null;
}

export function solve(input: string): number {
	const lines = input.split("\n");

	let safeReports = 0;
	for (const line of lines) {
		const report = line.split(" ");

		const unsafeIndex = checkReportSafety(report);
		if (unsafeIndex === null) safeReports++;
		else if (checkSafetyWithout(report, unsafeIndex)) safeReports++;
		else if (checkSafetyWithout(report, unsafeIndex - 1)) safeReports++;
		else if (checkSafetyWithout(report, 0)) safeReports++;
	}

	return safeReports;
}
