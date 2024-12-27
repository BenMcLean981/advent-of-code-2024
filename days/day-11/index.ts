import * as path from "jsr:@std/path";

import { isEven, readLines } from "../../utils.ts";

export function solveDay11(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Input = {
  values: ReadonlyArray<number>;
};

function parseInput(lines: ReadonlyArray<string>): Input {
  const values = lines[0]
    .split(" ")
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .map((s) => parseInt(s));

  return { values };
}

function solvePart1(input: Input): number {
  const rocks = makeRocks(input.values, 25);

  return countAllRocks(rocks);
}

function solvePart2(input: Input): number {
  const rocks = makeRocks(input.values, 75);

  return countAllRocks(rocks);
}

function makeRocks(
  values: ReadonlyArray<number>,
  remaining: number
): ReadonlyArray<Rock> {
  return values.map((value) => ({ value, blinks: 0, remaining }));
}

type Rock = {
  value: number;

  blinks: number;

  remaining: number;
};

function countAllRocks(rocks: ReadonlyArray<Rock>): number {
  const memo: Record<string, number> = {};

  return rocks.map((r) => countRocks(r, memo)).reduce((sum, n) => sum + n);
}

function getKey(rock: Rock): string {
  return `${rock.value}-${rock.blinks}`;
}

function countRocks(rock: Rock, memo: Record<string, number>): number {
  const result = lookupCount(rock, memo) ?? bruteCountRocks(rock, memo);

  memo[getKey(rock)] = result;

  return result;
}

function lookupCount(
  rock: Rock,
  memo: Record<string, number>
): number | undefined {
  const key = getKey(rock);

  if (key in memo) {
    return memo[key];
  }
}

function bruteCountRocks(rock: Rock, memo: Record<string, number>): number {
  if (rock.remaining === 0) {
    return 1;
  }

  const newRocks = processRock(rock);

  return newRocks.map((r) => countRocks(r, memo)).reduce((sum, n) => sum + n);
}

function processRock(rock: Rock): ReadonlyArray<Rock> {
  if (rock.value === 0) {
    return [blink(rock, 1)];
  } else if (isEven(getNumDigits(rock.value))) {
    return splitRock(rock);
  } else {
    return [blink(rock, rock.value * 2024)];
  }
}

function blink(rock: Rock, value: number): Rock {
  return { value, blinks: rock.blinks + 1, remaining: rock.remaining - 1 };
}

function splitRock(rock: Rock): [Rock, Rock] {
  const blinks = rock.blinks + 1;
  const remaining = rock.remaining - 1;
  const [value1, value2] = splitNumber(rock.value);

  return [
    { value: value1, blinks, remaining },
    { value: value2, blinks, remaining },
  ];
}

function getNumDigits(n: number): number {
  return n.toString().length;
}

function splitNumber(n: number): [number, number] {
  const s = n.toString();

  const firstHalf = s.slice(0, s.length / 2);
  const secondHalf = s.slice(s.length / 2);

  return [parseInt(firstHalf), parseInt(secondHalf)];
}

const factors: Record<number, ReadonlyArray<[number, number]>> = {};

function factorize(n: number): ReadonlyArray<[number, number]> {
  if (!(n in factors)) {
    factors[n] = bruteFactorize(n);
  }

  return factors[n];
}

function bruteFactorize(n: number): ReadonlyArray<[number, number]> {
  const results: Array<[number, number]> = [];

  for (let i = 1; i < Math.ceil(Math.sqrt(n)); i++) {
    const j = n / i;

    if (Number.isInteger(j)) {
      results.push([i, j]); // only need smallest first.
    }
  }

  return results;
}
