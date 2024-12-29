import * as path from "jsr:@std/path";

import { readLines } from "../../utils.ts";
import { Xy } from "../../utils/geometry/xy.ts";
import { isZero } from "../../utils/equality-checks.ts";

export function solveDay13(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Input = {
  games: ReadonlyArray<Game>;
};

type Game = {
  A: Xy;
  B: Xy;
  prize: Xy;
};

function parseInput(lines: ReadonlyArray<string>): Input {
  const games: Array<Game> = [];

  for (let i = 0; i < lines.length; i += 3) {
    const aSplit = lines[i].split(" ");
    const bSplit = lines[i + 1].split(" ");
    const prizeSplit = lines[i + 2].split(" ");

    const A = new Xy(
      parseInt(aSplit[2].slice(1)),
      parseInt(aSplit[3].slice(1))
    );
    const B = new Xy(
      parseInt(bSplit[2].slice(1)),
      parseInt(bSplit[3].slice(1))
    );

    const prize = new Xy(
      parseInt(prizeSplit[1].slice(2)),
      parseInt(prizeSplit[2].slice(2))
    );

    const game: Game = { A, B, prize };

    games.push(game);
  }

  return { games };
}

function solvePart1(input: Input): number {
  return getTotalCost(input.games);
}

function solvePart2(input: Input): number {
  const offset = new Xy(10000000000000, 10000000000000);
  const games = input.games.map(
    (game): Game => ({
      A: game.A,
      B: game.B,
      prize: game.prize.add(offset),
    })
  );

  return getTotalCost(games);
}

function getTotalCost(games: ReadonlyArray<Game>): number {
  return games.map(getCost).reduce((sum, c) => sum + c);
}

const A_COST = 3;
const B_COST = 1;

function getCost(game: Game): number {
  // The right thing to do here would be to write a matrix class,
  // but I don't want to do that right now.

  const det = game.A.x * game.B.y - game.B.x * game.A.y;

  if (isZero(det)) {
    return 0;
  }

  const a = (1 / det) * (game.prize.x * game.B.y - game.prize.y * game.B.x);
  const b = (1 / det) * (game.prize.y * game.A.x - game.prize.x * game.A.y);

  if (!isIntegerWithinPrecision(a) || !isIntegerWithinPrecision(b)) {
    return 0;
  }

  return a * A_COST + b * B_COST;
}

function isIntegerWithinPrecision(num: number, decimalPlaces = 4) {
  const tolerance = Math.pow(10, -decimalPlaces);
  const rounded = Math.round(num);

  return Math.abs(num - rounded) < tolerance;
}
