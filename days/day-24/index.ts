import * as path from "jsr:@std/path";

import { readLines } from "../../utils.ts";

export function solveDay24(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Input = {};

function parseInput(lines: ReadonlyArray<string>): Input {
  return {};
}

function solvePart1(input: Input): number {
  return 0;
}

function solvePart2(input: Input): number {
  return 0;
}
