import { readFile } from "node:fs/promises";
import { argv, exit } from "node:process";

const days = argv.slice(2); // the first two arguments are `node` and `dist/index.js`

for (let day of days) {
	const { part1, part2 } = await import(`./day${day}.js`).catch(() => {
		console.error(`Couldn't find code file for day ${day}`);
		exit(1);
	});

	let input = await readFile(`./inputs/day${day}.txt`)
		.then((buf) => buf.toString())
		.catch(() => {
			console.error(`Couldn't find input file for day ${day}`);
			exit(1);
		});

	console.log(`Solution for day ${day}, part 1: ${part1(input)}\n`);
	console.log(`Solution for day ${day}, part 2: ${part2(input)}\n`);
}
