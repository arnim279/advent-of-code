export const part1 = (input: string) => {
  let cave = Cave.fromInput(input);
  let sand = 0;
  while (!cave.addSand().fallsIntoVoid) sand++;
  return sand;
};

export const part2 = (input: string) => {
  let cave = Cave.fromInput(input);
  cave.addFloorAtOffset(2);
  let sand = 0;
  while (!cave.addSand().blocksSource) sand++;
  return sand + 1;
};

enum CellState {
  Air,
  Rock,
  Sand,
}

class Cave {
  private floorLevel?: number = undefined;

  constructor(private map: Map<number, Map<number, CellState>>) {}

  static fromInput(input: string) {
    let structures = input
      .split("\r\n")
      .filter((line) => line.length)
      .map((line) =>
        line
          .split(" -> ")
          .map((coordinates) => coordinates.split(",").map((v) => parseInt(v)))
      );

    let map: Map<number, Map<number, CellState>> = new Map();

    for (let structure of structures) {
      for (let i of structure.slice(1).keys()) {
        let [from, to] = structure.slice(i, i + 2);

        if (to[0] !== from[0]) {
          let y = from[1];

          let nX = to[0] - from[0];
          nX /= Math.abs(nX);

          for (let x = from[0]; x !== to[0] + nX; x += nX) {
            if (!map.has(y)) map.set(y, new Map());
            map.get(y).set(x, CellState.Rock);
          }
        } else {
          let x = from[0];

          let nY = to[1] - from[1];
          nY /= Math.abs(nY);

          for (let y = from[1]; y !== to[1] + nY; y += nY) {
            if (!map.has(y)) map.set(y, new Map());
            map.get(y).set(x, CellState.Rock);
          }
        }
      }
    }

    return new Cave(map);
  }

  addFloorAtOffset = (offset: number) => {
    let maxStructureYCoordinate = Array.from(this.map.keys()).reduce(
      (c, y) => Math.max(c, y),
      0
    );
    this.floorLevel = maxStructureYCoordinate + offset;
  };

  addSand = (): { fallsIntoVoid: boolean; blocksSource: boolean } => {
    let source = { x: 500, y: 0 };
    let pos = { ...source };

    while (true) {
      // Add floor level
      if (this.floorLevel) {
        if (!this.map.has(this.floorLevel)) {
          this.map.set(this.floorLevel, new Map());
        }
        this.map.get(this.floorLevel).set(pos.x - 1, CellState.Rock);
        this.map.get(this.floorLevel).set(pos.x, CellState.Rock);
        this.map.get(this.floorLevel).set(pos.x + 1, CellState.Rock);
      }

      if (Array.from(this.map.keys()).every((mapY) => mapY < pos.y)) {
        // No rocks below current pos, sand will fall into the void
        return { fallsIntoVoid: true, blocksSource: false };
      }

      // Check spot below current pos
      if (!this.map.get(pos.y + 1)?.get(pos.x)) {
        pos.y++;
        continue;
      }

      // Check down left
      if (!this.map.get(pos.y + 1)?.get(pos.x - 1)) {
        pos.x--;
        pos.y++;
        continue;
      }

      // Check down right
      if (!this.map.get(pos.y + 1)?.get(pos.x + 1)) {
        pos.x++;
        pos.y++;
        continue;
      }

      // Set spot to sand
      if (!this.map.has(pos.y)) this.map.set(pos.y, new Map());
      this.map.get(pos.y).set(pos.x, CellState.Sand);

      return {
        fallsIntoVoid: false,
        blocksSource: pos.x === source.x && pos.y === source.y,
      };
    }
  };
}
