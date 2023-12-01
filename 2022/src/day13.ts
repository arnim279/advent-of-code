export const part1 = (input: string) =>
  parseInput(input).reduce((c, [left, right], i) => {
    return c + (isInRightOrder(left, right) ? i + 1 : 0);
  }, 0);

export const part2 = (input: string) =>
  [...parseInput(input).flat(), [[2]], [[6]]]
    .sort((a, b) => {
      switch (isInRightOrder(a, b)) {
        case null:
        case true: {
          return -1;
        }
        case false: {
          return 1;
        }
      }
    })
    .reduce(
      (c, signal, i) =>
        c * (["[[2]]", "[[6]]"].includes(JSON.stringify(signal)) ? i + 1 : 1),
      1
    );

type Signal = (number | Signal)[];

const parseInput = (input: string) =>
  input.split("\r\n\r\n").map((lines) =>
    lines
      .split("\r\n")
      .filter((line) => line.length)
      .map((line) => JSON.parse(line) as Signal)
  );

const isInRightOrder = (
  left: Signal | number | undefined,
  right: Signal | number | undefined
): boolean | null => {
  if (typeof left === "number" && typeof right === "number") {
    return left !== right ? left < right : null;
  }

  if (left !== undefined && right === undefined) return false;
  if (right !== undefined && left === undefined) return true;

  if (typeof left === "number") return isInRightOrder([left], right);
  if (typeof right === "number") return isInRightOrder(left, [right]);

  let longerLength = Math.max(left.length, right.length);
  for (let i = 0; i < longerLength; i++) {
    let result = isInRightOrder(left[i], right[i]);
    if (result !== null) return result;
  }

  return null;
};
