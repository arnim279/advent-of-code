export const part1 = (input: string) => getFirstBatch(input, 4);

export const part2 = (input: string) => getFirstBatch(input, 14);

const getFirstBatch = (input: string, batchSize: number) => {
  for (let i = batchSize - 1; i < input.length; i++) {
    let chars = new Map<string, null>();
    for (let char of input.slice(i - batchSize + 1, i + 1)) {
      chars.set(char, null);
    }
    if (chars.size === batchSize) return i + 1;
  }
};
