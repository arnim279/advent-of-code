const parseInput = (input: string) => {
  let [stackLines, instructionLines] = input
    .split("\r\n\r\n")
    .map((lines) => lines.split("\r\n").filter((line) => line.length));

  return {
    stacks: getStacks(stackLines),
    instructions: getInstructions(instructionLines),
  };
};

const getStacks = (stackLines: string[]): string[][] => {
  let stacks = [];
  for (let line of stackLines.reverse().slice(1)) {
    //.slice(1) skips the line containing the stack indexes
    for (let [i, char] of line.split("").entries()) {
      if (i % 4 !== 1) continue; // stack contents are at index 1, 5, 9...
      let index = (i - 1) / 4; // our index should be 0, 1, 2 instead of 1, 5, 9
      while (stacks.length < index + 1) stacks.push([]); // if there is no stack at that index, create one
      if (char !== " ") stacks[index].push(char); // push char to stack if the character is not empty
    }
  }

  return stacks;
};

const getInstructions = (
  instructionLines: string[]
): { amount: number; from: number; to: number }[] => {
  let instructions = [];

  for (let instruction of instructionLines) {
    let [amount, from, to] = instruction
      .replaceAll(/[a-zA-Z]/g, "")
      .trim()
      .split("  ")
      .map((v) => parseInt(v));
    instructions.push({ amount, from, to });
  }

  return instructions;
};

export const part1 = (input: string) => {
  let { stacks, instructions } = parseInput(input);

  for (let instruction of instructions) {
    stacks[instruction.to - 1].push(
      ...stacks[instruction.from - 1].splice(-instruction.amount).reverse()
    );
  }

  return stacks.map((stack) => stack.at(-1)).join("");
};

export const part2 = (input: string) => {
  let { stacks, instructions } = parseInput(input);

  for (let instruction of instructions) {
    stacks[instruction.to - 1].push(
      ...stacks[instruction.from - 1].splice(-instruction.amount)
    );
  }

  return stacks.map((stack) => stack.at(-1)).join("");
};
