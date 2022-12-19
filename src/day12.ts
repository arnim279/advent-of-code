export const part1 = (input: string) => {
  let { map, start, end } = getMap(input);

  let dist = shortestPath(map, start, end);
  return dist;
};

export const part2 = (input: string) => {
  let { map, end } = getMap(input);
  let possibleStartPoints = [];
  for (let [y, r] of map.entries()) {
    for (let [x, p] of r.entries()) {
      if (p.value === "a".charCodeAt(0)) {
        possibleStartPoints.push([y, x]);
      }
    }
  }

  let minDist = Infinity;
  for (let start of possibleStartPoints) {
    let dist = shortestPath(copyMap(map), start, end);
    if (dist < minDist) minDist = dist;
  }

  return minDist;
};

type Vec2 = [number, number];
type Point = {
  value: number;
  visited: boolean;
  prev: Vec2 | null;
};

const getMap = (input: string) => {
  let start: Vec2, end: Vec2;

  let map: Point[][] = input
    .split("\r\n")
    .filter((line) => line.length)
    .map((line, li) =>
      line.split("").map((char, i) => {
        if (char === "S") {
          start = [li, i];
          char = "a";
        } else if (char === "E") {
          end = [li, i];
          char = "z";
        }

        return { value: char.charCodeAt(0), visited: false, prev: null };
      })
    );

  return { map, start, end };
};

let copyMap = (map: Point[][]): Point[][] => [
  ...map.map((row) => [...row.map((point) => ({ ...point }))]),
];

const shortestPath = (map: Point[][], start: Vec2, end: Vec2) => {
  let queue = [start];

  map[start[0]][start[1]].visited = true;

  while (queue.length) {
    let point = queue.shift();
    let mapPoint = map[point[0]][point[1]];

    if (point[0] === end[0] && point[1] === end[1]) {
      let length = 0;
      while (mapPoint.prev) {
        mapPoint = map[mapPoint.prev[0]][mapPoint.prev[1]];
        length++;
      }
      return length;
    }

    let neighbours = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (let n of neighbours) {
      let y = n[0] + point[0],
        x = n[1] + point[1];

      if (y < 0 || y >= map.length || x < 0 || x >= map[y].length) continue;

      let otherPoint = map[y][x];

      if (otherPoint.value > mapPoint.value + 1) continue;

      if (otherPoint.visited) continue;
      otherPoint.visited = true;
      otherPoint.prev = point;
      queue.push([y, x]);
    }
  }
};
