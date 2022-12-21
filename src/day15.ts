export const part1 = (input: string) => {
  let sensorDistances = parseInput(input).map(({ sensor, beacon }) => ({
    sensor,
    beacon,
    dist: manhattanDistance(sensor, beacon),
  }));

  let maxDistance = sensorDistances
    .map(({ dist }) => dist)
    .reduce((c, dist) => Math.max(c, dist), 0);

  let minX = sensorDistances
    .map(({ sensor, beacon }) => [sensor, beacon])
    .flat()
    .reduce((c, { x }) => Math.min(c, x), 0);

  let maxX = sensorDistances
    .map(({ sensor, beacon }) => [sensor, beacon])
    .flat()
    .reduce((c, { x }) => Math.max(c, x), 0);

  let y = 2000000;
  let numberOfInValidPos = 0;

  for (let x = minX - maxDistance; x <= maxX + maxDistance; x++) {
    for (let { sensor, dist } of sensorDistances) {
      if (manhattanDistance(sensor, { x, y }) <= dist) {
        numberOfInValidPos++;
        break;
      }
    }
  }

  return (
    numberOfInValidPos -
    sensorDistances
      .filter(({ beacon }) => beacon.y === y)
      // some beacons may be included in sensorDistances multiple times, filter them out here
      .reduce((c, { beacon: { x } }) => {
        if (!c.includes(x)) c.push(x);
        return c;
      }, []).length
  );
};

export const part2 = (input: string) => {
  let sensorDistances = parseInput(input).map(({ sensor, beacon }) => ({
    sensor,
    beacon,
    dist: manhattanDistance(sensor, beacon),
  }));

  let maxPos = 4000000;

  for (let { sensor, dist } of sensorDistances) {
    for (let [xo, yo] of [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      for (let dx = 0; dx <= dist; dx++) {
        let dy = dist + 1 - dx;
        let [x, y] = [sensor.x + dx * xo, sensor.y + dy * yo];
        if (
          x >= 0 &&
          x <= maxPos &&
          y >= 0 &&
          y <= maxPos &&
          sensorDistances.every(
            ({ sensor, dist }) => manhattanDistance(sensor, { x, y }) > dist
          )
        ) {
          let freq = x * 4000000 + y;
          return freq;
        }
      }
    }
  }
};

const posRegex = /at x=(?<x>(-?\d+)), y=(?<y>(-?\d+))/g;

const parseInput = (input: string) =>
  input
    .split("\r\n")
    .filter((line) => line.length)
    .map((line) => {
      let [sensor, beacon] = Array.from(line.matchAll(posRegex)).map(
        (a) =>
          Object.fromEntries(
            Object.entries(a.groups).map(([k, v]) => [k, parseInt(v)])
          ) as Point
      );

      return { sensor, beacon };
    });

type Point = { x: number; y: number };

const manhattanDistance = (a: Point, b: Point) =>
  Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
