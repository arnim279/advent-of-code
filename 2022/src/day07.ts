const TOTAL_DISK_SPACE = 70000000;
const UPDATE_DISK_SPACE = 30000000;

export const part1 = (input: string) => {
  const rootDir = parseFileSystemFromShell(input);
  let queue: Item[] = [rootDir];
  let dirSizes = [];
  for (let item of queue) {
    if (!(item instanceof Folder)) continue;
    let size = item.size;
    if (size < 100000) dirSizes.push(size);
    queue.push(...item.itemsWithoutLinks());
  }

  return dirSizes.reduce((sum, c) => sum + c, 0);
};

export const part2 = (input: string) => {
  const rootDir = parseFileSystemFromShell(input);
  const FREE_SPACE = TOTAL_DISK_SPACE - rootDir.size;
  const MISSING_SPACE = UPDATE_DISK_SPACE - FREE_SPACE;

  let queue: Item[] = [rootDir];
  let minDirSize = Infinity;
  for (let item of queue) {
    if (!(item instanceof Folder)) continue;
    if (item.size < MISSING_SPACE) continue;
    if (item.size < minDirSize) minDirSize = item.size;
    queue.push(...item.itemsWithoutLinks());
  }

  return minDirSize;
};

const parseFileSystemFromShell = (input: string): Folder => {
  let currentDir = new Folder("");
  currentDir.addItem(new Folder("/"));

  for (let [command, ...output] of input
    .split("$ ")
    .map((pair) => pair.split("\r\n"))) {
    if (command === "") continue;

    let [bin, ...args] = command.split(" ");
    output = output.filter((ln) => ln.length > 0);

    switch (bin) {
      case "cd": {
        let dir = currentDir.items.get(args[0]);
        if (!(dir instanceof Folder)) {
          throw new Error(
            `Current directory '${currentDir.name}' does not include subdirectory '${args[0]}'`
          );
        }
        currentDir = dir;
        break;
      }

      case "ls": {
        for (let [size, name] of output.map((ln) => ln.split(" "))) {
          switch (size) {
            case "dir": {
              currentDir.addItem(new Folder(name));
              break;
            }

            default: {
              currentDir.addItem(new File(name, parseInt(size)));
            }
          }
        }
        break;
      }

      default: {
        throw new Error(`Unknown command: '${bin}' (${command})`);
      }
    }
  }

  // Walk back up to root dir
  while (currentDir.name !== "/") {
    currentDir = currentDir.items.get("..") as Folder;
  }

  return currentDir;
};

interface Item {
  name: string;
  size: number;
  print: (depth: number) => void;
}

class File implements Item {
  constructor(public name: string, public size: number) {}

  print = (depth = 0) => {
    console.log(
      `${" ".repeat(depth * 2)} - ${this.name} (file, size=${this.size})`
    );
  };
}

class Folder implements Item {
  readonly items = new Map<string, Item>();
  public size = 0;

  constructor(public name: string) {}

  private addSize = (amount: number) => {
    this.size += amount;
    (this.items.get("..") as Folder)?.addSize(amount);
  };

  addItem = (item: Item) => {
    if (item instanceof Folder) {
      item.items.set(".", item);
      item.items.set("..", this);
    }
    this.items.set(item.name, item);
    this.addSize(item.size);
  };

  print = (depth = 0) => {
    console.log(`${" ".repeat(depth * 2)} - ${this.name} (dir)`);
    for (let [name, item] of this.items.entries()) {
      if (name === "." || name === "..") continue;
      item.print(depth + 1);
    }
  };

  itemsWithoutLinks = () =>
    Array.from(this.items.entries())
      .filter(([name]) => name !== "." && name !== "..")
      .map(([_, item]) => item);
}
