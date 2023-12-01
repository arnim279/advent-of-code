export const part1 = (input: string) => {
  let { dropletList, dropletMap } = parseInput(input);

  let area = 0;

  for (let droplet of dropletList) {
    for (let delta of [-1, 1]) {
      for (let dIndex of [0, 1, 2]) {
        let adjacent: Point = [...droplet];
        adjacent[dIndex] += delta;
        if (!dropletMap[adjacent[0]]?.[adjacent[1]]?.[adjacent[2]]) {
          area++;
        }
      }
    }
  }

  return area;
};

type Point = [number, number, number];

export const part2 = (input: string) => {
  let { dropletList, dropletMap } = parseInput(input);

  let map = new Map<string, boolean>();

  const isOutsideDroplet = (p: Point, visited: Point[] = []): boolean => {
    if (map.has(p.join())) return map.get(p.join());

    for (let delta of [-1, 1]) {
      for (let dIndex of [0, 1, 2]) {
        let adjacent: Point = [...p];
        adjacent[dIndex] += delta;

        if (visited.some((p) => p.join() === adjacent.join())) continue;

        if (dropletMap[adjacent[0]]?.[adjacent[1]]?.[adjacent[2]]) continue;

        if (
          // If adjacent pos it outside array, it's also outside the droplet
          dropletMap[adjacent[0]]?.[adjacent[1]]?.[adjacent[2]] === undefined ||
          // Otherwise check recursively if the adjacent pos is outside
          isOutsideDroplet(adjacent, [...visited, p])
        ) {
          map.set(p.join(), true);
          return true;
        }
      }
    }

    map.set(p.join(), false);
    return false;
  };

  let area = 0;

  for (let droplet of dropletList) {
    for (let delta of [-1, 1]) {
      for (let dIndex of [0, 1, 2]) {
        let adjacent: Point = [...droplet];
        adjacent[dIndex] += delta;

        if (
          !dropletMap[adjacent[0]]?.[adjacent[1]]?.[adjacent[2]] &&
          isOutsideDroplet(adjacent)
        ) {
          area++;
        }
      }
    }
  }

  return area;
};

const parseInput = (input: string) => {
  let dropletList: Point[] = [];

  for (let cubeLine of input.split("\r\n").filter((line) => line.length)) {
    let [x, y, z] = cubeLine.split(",").map((c) => parseInt(c));
    dropletList.push([x, y, z]);
  }

  let [maxX, maxY, maxZ] = dropletList.reduce(
    ([maxX, maxY, maxZ], [x, y, z]) => [
      Math.max(maxX, x),
      Math.max(maxY, y),
      Math.max(maxZ, z),
    ],
    [0, 0, 0]
  );

  let dropletMap: boolean[][][] = new Array(maxX + 1)
    .fill(null)
    .map(() =>
      new Array(maxY + 1).fill(null).map(() => new Array(maxZ + 1).fill(false))
    );

  for (let [x, y, z] of dropletList) {
    dropletMap[x][y][z] = true;
  }

  return { dropletList, dropletMap };
};
