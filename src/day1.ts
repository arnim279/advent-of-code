export const part1 = (input: string) => Math.max(...getElfCalories(input));

export const part2 = (input: string) =>
	getElfCalories(input)
		.sort((a, b) => a - b)
		.slice(-3)
		.reduce((prev, c) => prev + c, 0);

const getElfCalories = (input: string) =>
	input
		.split("\n")
		.reduce<number[][]>(
			(calories, line) => {
				let c = parseInt(line.trim());
				if (isNaN(c)) calories.push([]);
				else calories.at(-1).push(c);
				return calories;
			},
			[[]]
		)
		.map((elfCalories) => elfCalories.reduce((prev, c) => prev + c, 0));
