import * as path from "jsr:@std/path";

import { readLines } from "../../utils.ts";
import { WordSearch } from "./word-search.ts";
import { Grid } from "../../utils/grid.ts";

export function solveDay4(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Input = {
  wordSearch: WordSearch;
};

function parseInput(lines: ReadonlyArray<string>): Input {
  const wordSearch = new WordSearch(new Grid(lines.map((l) => l.split(""))));

  return { wordSearch };
}

function solvePart1(input: Input): number {
  return input.wordSearch.countXmas();
}

function solvePart2(input: Input): number {
  return input.wordSearch.countXmasShape();
}
