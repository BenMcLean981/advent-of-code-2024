import * as path from "jsr:@std/path";

import { CellContent, Map } from "./map.ts";
import { readLines } from "../../utils.ts";
import { Grid } from "../../utils/grid.ts";

export function solveDay8(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Input = {
  map: Map;
};

function parseInput(lines: ReadonlyArray<string>): Input {
  const grid = new Grid(lines.map((l) => l.split("").map(convertCell)));
  const map = new Map(grid);

  return { map };
}

function convertCell(c: string): CellContent {
  if (c === ".") {
    return { type: "Empty" };
  } else {
    return { type: "Antenna", frequency: c };
  }
}

function solvePart1(input: Input): number {
  return input.map.getAllDoubleDistanceAntinodes().length;
}

function solvePart2(input: Input): number {
  return input.map.getAllAntinodes().length;
}
