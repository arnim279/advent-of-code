export const part1 = (input: string) =>
	getPairs(input).filter(([section1, section2]) => {
		for (let [a, b] of [
			[section1, section2],
			[section2, section1],
		]) {
			if (b[0] >= a[0] && b[1] <= a[1]) return true; // a fully constains b
		}
	}).length;

export const part2 = (input: string) =>
	getPairs(input).filter(([section1, section2]) => {
		for (let [a, b] of [
			[section1, section2],
			[section2, section1],
		]) {
			if (b[0] >= a[0] && b[0] <= a[1]) return true; // a[0] <= b[0] <= a[1] (b starts in a)
		}
	}).length;

const getPairs = (input: string) =>
	input
		.split("\r\n")
		.filter((line) => line.length)
		.map((pair) =>
			pair
				.split(",")
				.map((section) => section.split("-").map((v) => parseInt(v)))
		); // returns [[start1, end1], [start2, end2]]
