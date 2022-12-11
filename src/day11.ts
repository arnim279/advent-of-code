export const part1 = (input: string) => {
  let monkeys = getMonkeysFromInput(input);
  for (let i = 0; i < 20; i++) {
    for (let monkey of monkeys) {
      monkey.inspectItems();
    }
  }

  return monkeys
    .map((m) => m.numberOfInspections)
    .sort((a, b) => a - b)
    .slice(-2)
    .reduce((total, c) => total * c, 1);
};

export const part2 = (input: string) => {
  let monkeys = getMonkeysFromInput(input);

  let productOfDivisibilities = 1;
  for (let m of monkeys) productOfDivisibilities *= m.divisor;

  for (let i = 0; i < 10000; i++) {
    for (let monkey of monkeys) {
      monkey.inspectItems(false, productOfDivisibilities);
    }
  }

  return monkeys
    .map((m) => m.numberOfInspections)
    .sort((a, b) => a - b)
    .slice(-2)
    .reduce((total, c) => total * c, 1);
};

const getMonkeysFromInput = (input: string) => {
  let monkeys: Monkey[] = [];

  for (let monkeyDescription of input
    .split("\r\n\r\n")
    .filter((line) => line.length)) {
    let [startingItems, operation, test, testTrue, testFalse] =
      monkeyDescription
        .split("\r\n")
        .filter((line) => line.length)
        .map((line) => line.trim().split(": ")[1])
        .filter((line) => line !== undefined);

    let divisor = parseInt(test.split(" ").at(-1));

    monkeys.push(
      new Monkey(
        startingItems.split(", ").map((v) => parseInt(v)),
        (old: number) => eval(operation.split("= ")[1]),
        divisor,
        (worryLevel: number) =>
          parseInt(
            (worryLevel % divisor === 0 ? testTrue : testFalse)
              .split(" ")
              .at(-1)
          ),
        monkeys
      )
    );
  }

  return monkeys;
};

class Monkey {
  items: number[];
  numberOfInspections = 0;

  constructor(
    initialItems: number[],
    private operation: (old: number) => number,
    public divisor: number,
    private nextMonkeyIndex: (worryLevel: number) => number,
    private allMonkeys: Monkey[]
  ) {
    this.items = initialItems;
  }

  inspectItems(monkeyCanGetBored = true, productOfDivisibilities = Infinity) {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];

      // Inspect item, increase worry level accordingly
      item = this.operation(item) % productOfDivisibilities;
      this.numberOfInspections++;

      // Get bored, divide worry level by 3
      if (monkeyCanGetBored) item = Math.floor(item / 3);

      // Give item to next monkey
      let nextMonkeyIndex = this.nextMonkeyIndex(item);
      this.allMonkeys[nextMonkeyIndex].items.push(item);

      // Remove item from current monkey and decrement index by 1
      this.items.splice(i--, 1);
    }
  }
}
