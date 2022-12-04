export const part1 = (input: string) =>
  input
    .split("\r\n")
    .filter((row) => row.length)
    .map((row) => {
      let [opponent, own] = row.split(" ");

      let opponentShape = getOpponentShape(opponent);

      let ownShape =
        own === "X" ? Shape.Rock : own === "Y" ? Shape.Paper : Shape.Scissors;

      const status =
        ownShape === opponentShape
          ? GameStatus.Draw
          : (opponentShape + 1) % 3 === ownShape // own shape is 1 more than opponent shape
          ? GameStatus.Won
          : GameStatus.Lost;

      return getStatusScore(status) + getShapeScore(ownShape);
    })
    .reduce((sum, c) => sum + c, 0);

export const part2 = (input: string) =>
  input
    .split("\r\n")
    .filter((row) => row.length)
    .map((row) => {
      let [opponent, result] = row.split(" ");

      let opponentShape = getOpponentShape(opponent);

      let status =
        result === "X"
          ? GameStatus.Lost
          : result === "Y"
          ? GameStatus.Draw
          : GameStatus.Won;

      let ownShape =
        status === GameStatus.Lost
          ? (opponentShape - 1 + 3) % 3 // own shape should be 1 less
          : status === GameStatus.Draw
          ? opponentShape // same shape
          : (opponentShape + 1) % 3; // own shape should be 1 more

      return getStatusScore(status) + getShapeScore(ownShape);
    })
    .reduce((sum, c) => sum + c, 0);

enum Shape {
  Rock,
  Paper,
  Scissors,
}

const getShapeScore = (shape: Shape) => shape + 1;

const getOpponentShape = (opponentCode: string) =>
  opponentCode === "A"
    ? Shape.Rock
    : opponentCode === "B"
    ? Shape.Paper
    : Shape.Scissors;

enum GameStatus {
  Lost,
  Draw,
  Won,
}

const getStatusScore = (status: GameStatus) => status * 3;
