import { existsSync as fileExists } from "node:fs";
import { writeFile } from "node:fs/promises";
import { argv, exit } from "node:process";

const days = argv.slice(2); // the first two arguments are `node` and `dist/new-day.js`

const defaultContent = [
  "export const part1 = (input: string) => null",
  "export const part2 = (input: string) => null",
].join("\n\n");

for (let day of days) {
  let day2 = day.padStart(2, "0");

  if (
    fileExists(`./src/day${day2}.ts`) ||
    fileExists(`./inputs/day${day2}.txt`)
  ) {
    console.error(`Input or code files for day ${day} already exist`);
    continue;
  }

  await writeFile(`./src/day${day2}.ts`, defaultContent).catch(() => {
    console.error(`Couldn't create new code file for day ${day}`);
    exit(1);
  });

  await writeFile(`./inputs/day${day2}.txt`, "").catch(() => {
    console.error(`Couldn't create new input file for day ${day}`);
    exit(1);
  });
}
