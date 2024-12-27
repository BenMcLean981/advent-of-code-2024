import * as path from "jsr:@std/path";

import { readLines } from "../../utils.ts";
import { Grid } from "../../utils/grid.ts";
import { Xy } from "../../utils/xy.ts";
import { Region } from "./region.ts";

export function solveDay12(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Input = {
  garden: Grid<string>;
};

function parseInput(lines: ReadonlyArray<string>): Input {
  const garden = new Grid(
    lines.map((line) =>
      line
        .split("")
        .map((s) => s.trim())
        .filter((s) => s !== "")
    )
  );

  return { garden };
}

function solvePart1(input: Input): number {
  const regions = getRegions(input.garden);
  const merged = mergeRegions(regions);

  return merged.map((r) => r.price).reduce((sum, n) => sum + n);
}

function solvePart2(input: Input): number {
  return 0;
}

function getRegions(garden: Grid<string>): ReadonlyArray<Region> {
  return [...garden.positions].map((position): Region => {
    const plant = garden.get(position);

    if (plant === undefined) {
      throw new Error("Grid error.");
    }

    return new Region(plant, [position]);
  });
}

function mergeRegions(regions: ReadonlyArray<Region>): ReadonlyArray<Region> {
  const result: Array<Region> = [regions[0]];

  regions.slice(1).forEach((r1) => {
    const matchIndex = result.findIndex((r2) => areCompatible(r1, r2));

    if (matchIndex === -1) {
      result.push(r1);
    } else {
      const r2 = result[matchIndex];
      result[matchIndex] = r1.merge(r2);
    }
  });

  if (result.length === regions.length) {
    return result;
  } else {
    return mergeRegions(result);
  }
}

function areCompatible(r1: Region, r2: Region): boolean {
  return r1.plant === r2.plant && r1.touches(r2);
}

type Plant = {
  plant: string;

  position: Xy;
};
