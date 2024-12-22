import * as path from "jsr:@std/path";

import { readLines } from "../../utils.ts";
import { Grid } from "../../utils/grid.ts";
import { Map } from "./map.ts";

export function solveDay10(filename: string) {
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
  const nums = lines.map((l) => l.split("").map((n) => parseInt(n)));
  const grid = new Grid(nums);
  const map = new Map(grid);

  return { map };
}

function solvePart1(input: Input): number {
  const trails = input.map.getTrails();

  const counts: Record<string, Set<string>> = {};

  trails.forEach((t) => {
    if (t.start.hash() in counts) {
      counts[t.start.hash()].add(t.end.hash());
    } else {
      counts[t.start.hash()] = new Set([t.end.hash()]);
    }
  });

  return Object.values(counts)
    .map((s) => s.size)
    .reduce((sum, n) => sum + n);
}

function solvePart2(input: Input): number {
  const trails = input.map.getTrails();

  return trails.length;
}
