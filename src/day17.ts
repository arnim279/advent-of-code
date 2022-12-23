export const part1 = (input: string) => {
  let cave = new Cave();
  let movements = new Generator(parseInput(input));
  return cave.simulate(movements, 2022);
};

// This won't actually run in any reasonable time (my estimate is that it'll take about 40 days to run)
// Can probably be optimized by using bitwise operators instead of checking the array items individually
export const part2 = (input: string) => {
  let cave = new Cave();
  let movements = new Generator(parseInput(input));
  return cave.simulate(movements, 1000000000000);
};

enum Direction {
  Down,
  Left = "<",
  Right = ">",
}

enum CellState {
  Air = ".",
  Rock = "#",
}

const parseInput = (input: string) =>
  input
    .trim()
    .split("")
    .map((char) => {
      switch (char) {
        case "<": {
          return Direction.Left;
        }

        case ">": {
          return Direction.Right;
        }
      }
    });

class Generator<T> {
  private i = -1;
  constructor(private data: T[]) {}
  current = () => this.elementAtIndex(this.i);
  next = () => this.elementAtIndex(++this.i);
  private elementAtIndex = (i: number) => this.data[i % this.data.length];
}

type Position = { x: number; y: number };

const rockTypes = [
  ["####"],
  [".#.", "###", ".#."],
  ["..#", "..#", "###"],
  ["#", "#", "#", "#"],
  ["##", "##"],
].map((rows) =>
  rows.map((row) =>
    row.split("").map((char) => {
      switch (char) {
        case ".": {
          return CellState.Air;
        }

        case "#": {
          return CellState.Rock;
        }
      }
    })
  )
);

class Cave {
  private grid: CellState[][] = [new Array(7).fill(CellState.Rock)]; // Initialize with floor

  simulate = (movements: Generator<Direction>, iterationCount: number) => {
    let rocks = new Generator(rockTypes);
    let height = 0;

    for (let i = 0; i < iterationCount; i++) {
      this.grid.push(
        ...new Array(3)
          .fill(null)
          .map(() => [...new Array(7).fill(null).map(() => CellState.Air)])
      );

      let rock = rocks.next();
      let pos: Position = { x: 2, y: this.grid.length };

      while (true) {
        let movement = movements.next();

        // Try to move rock into movement direction
        if (this.canMoveRock(rock, pos, movement)) {
          this.move(pos, movement);
        }

        // Try to move rock down, if it's blocked, settle rock and continue
        if (this.canMoveRock(rock, pos, Direction.Down)) {
          this.move(pos, Direction.Down);
        } else {
          this.settleRock(rock, pos);
          break;
        }
      }

      // Remove all air-only rows at the top
      while (true) {
        if (this.grid.at(-1).every((cell) => cell === CellState.Air)) {
          this.grid.pop();
        } else {
          break;
        }
      }

      // Remove all rows up to the last stone-only row as they aren't needed for collision checks anymore
      let j =
        this.grid.length -
        1 -
        [...this.grid]
          .reverse()
          .findIndex((row) => row.every((cell) => cell === CellState.Rock));

      if (j !== 0) {
        height += this.grid.splice(0, j).length;
      }
    }

    return height + this.grid.length - 1;
  };

  private canMoveRock = (
    rock: CellState[][],
    pos: Position,
    direction: Direction
  ) => {
    let rockXSize = Math.max(...rock.map((row) => row.length));

    pos = this.move({ ...pos }, direction);

    switch (direction) {
      case Direction.Left: {
        if (pos.x < 0) return false;
        break;
      }

      case Direction.Right: {
        if (pos.x + rockXSize > 7) return false;
        break;
      }
    }

    for (let [y, row] of [...rock].reverse().entries()) {
      for (let [x, rockCell] of row.entries()) {
        if (
          this.grid[pos.y + y]?.[pos.x + x] === CellState.Rock &&
          rockCell === CellState.Rock
        ) {
          return false;
        }
      }
    }

    return true;
  };

  private move = (position: Position, direction: Direction): Position => {
    switch (direction) {
      case Direction.Down: {
        position.y--;
        break;
      }

      case Direction.Left: {
        position.x--;
        break;
      }

      case Direction.Right: {
        position.x++;
        break;
      }
    }

    return position;
  };

  private settleRock = (rock: CellState[][], pos: Position) => {
    for (let [y, row] of [...rock].reverse().entries()) {
      for (let [x, rockCell] of row.entries()) {
        if (pos.y + y >= this.grid.length) {
          // Add enough air rows on top that can be replaced by the rock structure
          this.grid.push(
            ...new Array(pos.y + y + 1 - this.grid.length)
              .fill(null)
              .map(() => new Array(7).fill(null).map(() => CellState.Air))
          );
        }

        // Only update grid cell if it's still an air cell
        if (this.grid[pos.y + y][pos.x + x] === CellState.Air) {
          this.grid[pos.y + y][pos.x + x] = rockCell;
        }
      }
    }
  };
}
