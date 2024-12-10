import * as path from "jsr:@std/path";

import { readLines } from "../../utils.ts";
import { Grid } from "../../utils/grid.ts";
import { Xy } from "../../utils/xy.ts";
import { CellContent, Guard, Map } from "./map.ts";

export function solveDay6(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.warn("This is slow, but not so slow that I'm going to fix it.");
  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Input = { map: Map };

function parseInput(lines: ReadonlyArray<string>): Input {
  const grid = new Grid(lines.map((l) => l.split("").map(getContent)));
  const guard = findGuard(lines);

  if (guard === undefined) {
    throw new Error("No guard on the map.");
  }

  const map = new Map(grid, guard);

  return { map };
}

function getContent(c: string): CellContent {
  switch (c) {
    case "^":
    case ">":
    case "v":
    case "<":
    case ".":
      return "Empty";
    case "#":
      return "Obstruction";
    default:
      throw new Error(`Unsupported content "${c}".`);
  }
}

function findGuard(lines: ReadonlyArray<string>): Guard | undefined {
  return lines
    .flatMap((line, y) =>
      [...line].map((c, x) => {
        const position = new Xy(x, y);

        if (c === "^") {
          return { position, direction: new Xy(0, -1) };
        } else if (c === ">") {
          return { position, direction: new Xy(1, 0) };
        } else if (c === "v") {
          return { position, direction: new Xy(0, 1) };
        } else if (c === "<") {
          return { position, direction: new Xy(-1, 0) };
        }
      })
    )
    .find((g) => g !== undefined);
}

function solvePart1(input: Input): number {
  return getVisitedPositions(input.map).length;
}

function getVisitedPositions(map: Map): ReadonlyArray<Xy> {
  const positions = new Set<string>();

  const copy = map.clone();

  while (!copy.isGuardOffMap) {
    positions.add(copy.guard.position.hash());

    copy.step();
  }

  return [...positions].map((hash) => Xy.parse(hash));
}

function solvePart2(input: Input): number {
  const visited = getVisitedPositions(input.map);
  const positions = visited.filter((p) => !p.equals(input.map.guard.position));

  const maps = positions.map((pos) => input.map.addObstruction(pos));

  return maps.filter(isStuckInLoop).length;
}

function isStuckInLoop(map: Map): boolean {
  const states = new Set();

  while (!map.isGuardOffMap) {
    states.add(hashGuard(map.guard));

    map.step();

    if (states.has(hashGuard(map.guard))) {
      return true;
    }
  }

  return false;
}

function hashGuard(guard: Guard): string {
  return JSON.stringify({
    position: guard.position.hash(),
    direction: guard.direction.hash(),
  });
}
