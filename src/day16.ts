// This solution is super slow, but I already spent way too much time on this
// so I'll just continue with day 17 and never look at this again

// Rewrite for part 2 inspired by https://www.reddit.com/r/adventofcode/comments/zo21au/comment/j0nz8df

export const part1 = (input: string) => {
  let { valves } = parseInput(input);
  let distances = valveDistances(Array.from(valves.values()));

  let paths = possiblePaths(valves.get("AA"), 30, distances);
  return Math.max(...paths.values());
};

export const part2 = (input: string) => {
  let { valves } = parseInput(input);
  let distances = valveDistances(Array.from(valves.values()));

  let paths = possiblePaths(valves.get("AA"), 26, distances);

  let max = 0;
  for (let [pathA, scoreA] of paths) {
    for (let [pathB, scoreB] of paths) {
      let valvesA = pathA.split(",");
      let valvesB = pathB.split(",");

      if (
        valvesA.every((v) => !valvesB.includes(v)) &&
        valvesB.every((v) => !valvesA.includes(v))
      ) {
        max = Math.max(max, scoreA + scoreB);
      }
    }
  }

  return max;
};

type Valve = {
  name: string;
  flowRate: number;
  connections: Valve[];
};

const valveRegex =
  /Valve (?<name>([A-Z]+)) has flow rate=(?<flowRate>(\d+)); tunnels? leads? to valves? (?<connections>(([A-Z]+)(, )?)*)/;

const parseInput = (input: string) => {
  let valveConnections = new Map<string, string[]>();
  let valves = new Map<string, Valve>();

  for (let valveString of input.split("\r\n").filter((line) => line.length)) {
    let { name, flowRate, connections } = valveString.match(valveRegex).groups;

    valves.set(name, {
      name,
      flowRate: parseInt(flowRate),
      connections: [],
    });
    valveConnections.set(name, connections.split(", "));
  }

  for (let [name, connections] of valveConnections.entries()) {
    valves.get(name).connections = connections.map((name) => valves.get(name));
  }

  return {
    firstValve: valves.get("AA"),
    valves,
  };
};

const valveDistances = (valves: Valve[]) => {
  let map = new Map<Valve, Map<Valve, number>>();

  for (let from of valves) {
    if (!map.has(from)) map.set(from, new Map());

    for (let to of valves) {
      if (!map.has(to)) map.set(to, new Map());

      let dist = Math.min(
        map.get(from).get(to) ?? Infinity,
        map.get(to).get(from) ?? Infinity,
        minDistance(from, to)
      );

      map.get(from).set(to, dist);
      map.get(to).set(from, dist);
    }
  }

  return map;
};

const minDistance = (
  from: Valve,
  to: Valve,
  visited: Valve[] = [],
  lvl = 0
) => {
  if (from === to) return 0;

  if (visited.includes(from)) return Infinity;

  return (
    Math.min(
      ...from.connections.map((adjacent) =>
        minDistance(adjacent, to, [...visited, from], lvl + 1)
      )
    ) + 1
  );
};

// Couldn't figure out how to implement this using iterators instead of recursion lol
// This is probably why my solution takes so much longer than the python version
const possiblePaths = (
  valve: Valve,
  remainingTime: number,
  valveDistances: Map<Valve, Map<Valve, number>>,
  relievedPressure = 0,
  openedValves: Valve[] = [],
  pathCombinations = new Map<string, number>()
) => {
  for (let [other, distance] of valveDistances.get(valve)) {
    if (openedValves.includes(other) || other.flowRate === 0) continue;

    let remainingTime2 = remainingTime - distance - 1;
    if (remainingTime2 <= 0) continue;

    let pressure = relievedPressure + other.flowRate * remainingTime2;

    let key = [...openedValves, other]
      .map((v) => v.name)
      .sort()
      .join();

    pathCombinations.set(
      key,
      Math.max(pathCombinations.get(key) ?? 0, pressure)
    );

    possiblePaths(
      other,
      remainingTime2,
      valveDistances,
      pressure,
      [...openedValves, other],
      pathCombinations
    );
  }

  return pathCombinations;
};
