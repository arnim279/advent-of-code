export const part1 = (input: string) => {
  let instructions = getInstructions(input);
  let totalStrength = 0;

  simulate(instructions, (x, cycleCount) => {
    if (cycleCount % 40 === 20) totalStrength += cycleCount * x;
  });

  return totalStrength;
};

export const part2 = (input: string) => {
  let instructions = getInstructions(input);
  let display = new Array(40 * 6).fill(" ");

  simulate(instructions, (x, cycleCount) => {
    let spritePos = x;
    let pixelPos = (cycleCount % 40) - 1;
    if (pixelPos >= spritePos - 1 && pixelPos <= spritePos + 1) {
      display[cycleCount - 1] = "#";
    }
  });

  return (
    "\n" +
    display
      .join("")
      .match(/.{1,40}/g) // Split every 40 characters
      .join("\n")
  );
};

type Instruction = { instruction: string; value: number };

const getInstructions = (input: string): Instruction[] =>
  input
    .split("\r\n")
    .filter((line) => line.length)
    .map((line) => {
      let [instruction, value] = line.split(" ");
      return { instruction, value: parseInt(value) };
    });

function* addX(x: number, v: number) {
  yield x;
  return x + v;
}

function* noop(x: number) {
  return x;
}

const simulate = (
  instructions: Instruction[],
  duringExecution?: (x: number, cycleCount: number) => void
) => {
  let x = 1;
  let current: Generator<number, number, unknown> | null = null;

  for (let cycleCount = 1; instructions.length > 0 || current; cycleCount++) {
    if (!current) {
      let { instruction, value: v } = instructions.shift();

      switch (instruction) {
        case "addx": {
          current = addX(x, v);
          break;
        }

        case "noop": {
          current = noop(x);
          break;
        }
      }
    }

    duringExecution?.(x, cycleCount);

    let { value, done } = current.next();
    x = value;
    if (done) current = null;
  }
};
