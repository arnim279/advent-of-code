export const part1 = (input: string) => {
  let instructions = getInstructions(input);

  let head = new Point(0, 0);
  let tail = new Point(0, 0);

  let visitedPoints = new Map<string, null>();

  for (let [direction, amount] of instructions) {
    while (amount-- > 0) {
      head.moveInDirection(direction);
      if (!tail.isAdjacentTo(head)) tail.moveTowards(head);
      visitedPoints.set([tail.x, tail.y].join(), null);
    }
  }

  return visitedPoints.size;
};

export const part2 = (input: string) => {
  let instructions = getInstructions(input);

  let knots = new Array(10).fill(0).map(() => new Point(0, 0));
  let head = knots[0];
  let tail = knots.at(-1);

  let visitedPoints = new Map<string, null>();

  for (let [direction, amount] of instructions) {
    while (amount-- > 0) {
      head.moveInDirection(direction);
      for (let [i, knot] of knots.slice(1).entries()) {
        let prevKnot = knots[i];
        if (!knot.isAdjacentTo(prevKnot)) knot.moveTowards(prevKnot);
      }
      visitedPoints.set([tail.x, tail.y].join(), null);
    }
  }

  return visitedPoints.size;
};

const getInstructions = (input: string) =>
  input
    .split("\r\n")
    .filter((line) => line.length)
    .map((line) => {
      let [direction, amount] = line.split(" ");
      return [direction as Direction, parseInt(amount)] as const;
    });

enum Direction {
  Up = "U",
  Right = "R",
  Down = "D",
  Left = "L",
}

class Point {
  constructor(public x: number, public y: number) {}

  moveTowards = (other: Point) => {
    let [dX, dY] = [other.x - this.x, other.y - this.y];

    if (dX !== 0) {
      this.x += dX / Math.abs(dX);
    }
    if (dY !== 0) {
      this.y += dY / Math.abs(dY);
    }
  };

  moveInDirection = (direction: Direction) => {
    switch (direction) {
      case Direction.Up: {
        this.y += 1;
        break;
      }

      case Direction.Right: {
        this.x += 1;
        break;
      }

      case Direction.Down: {
        this.y -= 1;
        break;
      }

      case Direction.Left: {
        this.x -= 1;
        break;
      }
    }
  };

  isAdjacentTo = (other: Point) => {
    let [dX, dY] = [other.x - this.x, other.y - this.y];
    return Math.abs(dX) <= 1 && Math.abs(dY) <= 1;
  };
}
