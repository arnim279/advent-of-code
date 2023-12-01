import { readFile } from "node:fs/promises";
import { argv, exit } from "node:process";

const days = argv.slice(2); // the first two arguments are `node` and `dist/index.js`

for (let day of days) {
  let day2 = day.padStart(2, "0");

  const { part1, part2 } = await import(`./day${day2}.js`).catch(() => {
    console.error(`Couldn't find code file for day ${day}`);
    exit(1);
  });

  let input = await readFile(`./inputs/day${day2}.txt`)
    .then((buf) => buf.toString())
    .catch(() => {
      console.error(`Couldn't find input file for day ${day}`);
      exit(1);
    });

  console.log(`Solution for day ${day}, part 1: ${part1(input)}`);
  console.log(`Solution for day ${day}, part 2: ${part2(input)}\n`);
}
