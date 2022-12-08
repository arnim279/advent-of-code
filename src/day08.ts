export const part1 = (input: string) => {
  let trees = getTrees(input);
  let amountOfVisibleTrees = 0;

  for (let y = 0; y < trees.length; y++) {
    for (let x = 0; x < trees[y].length; x++) {
      let visible = {
        top: true,
        right: true,
        bottom: true,
        left: true,
      };

      for (let wy = y - 1; wy >= 0; wy--) {
        if (trees[wy][x] >= trees[y][x]) {
          visible.top = false;
          break;
        }
      }

      for (let wx = x + 1; wx < trees[y].length; wx++) {
        if (trees[y][wx] >= trees[y][x]) {
          visible.right = false;
          break;
        }
      }

      for (let wy = y + 1; wy < trees.length; wy++) {
        if (trees[wy][x] >= trees[y][x]) {
          visible.bottom = false;
          break;
        }
      }

      for (let wx = x - 1; wx >= 0; wx--) {
        if (trees[y][wx] >= trees[y][x]) {
          visible.left = false;
          break;
        }
      }

      if (Object.values(visible).some((v) => v)) amountOfVisibleTrees++;
    }
  }

  return amountOfVisibleTrees;
};

export const part2 = (input: string) => {
  let trees = getTrees(input);
  let highestScenicScore = 0;

  for (let y = 0; y < trees.length; y++) {
    for (let x = 0; x < trees[y].length; x++) {
      let scenicScore = {
        top: y,
        right: trees[y].length - 1 - x,
        bottom: trees.length - 1 - y,
        left: x,
      };

      for (let wy = y - 1; wy >= 0; wy--) {
        if (trees[wy][x] >= trees[y][x]) {
          scenicScore.top = y - wy;
          break;
        }
      }

      for (let wx = x + 1; wx < trees[y].length; wx++) {
        if (trees[y][wx] >= trees[y][x]) {
          scenicScore.right = wx - x;
          break;
        }
      }

      for (let wy = y + 1; wy < trees.length; wy++) {
        if (trees[wy][x] >= trees[y][x]) {
          scenicScore.bottom = wy - y;
          break;
        }
      }

      for (let wx = x - 1; wx >= 0; wx--) {
        if (trees[y][wx] >= trees[y][x]) {
          scenicScore.left = x - wx;
          break;
        }
      }

      let score =
        scenicScore.top *
        scenicScore.right *
        scenicScore.bottom *
        scenicScore.left;

      if (score > highestScenicScore) highestScenicScore = score;
    }
  }

  return highestScenicScore;
};

const getTrees = (input: string): number[][] =>
  input
    .split("\r\n")
    .filter((row) => row.length)
    .map((row) => row.split("").map((v) => parseInt(v)));
