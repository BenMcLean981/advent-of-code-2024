import * as path from "jsr:@std/path";

import { readLines } from "../../utils.ts";

export function solveDay1(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.log("Day 1");
  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Input = {
  left: ReadonlyArray<number>;
  right: ReadonlyArray<number>;
};

function parseInput(lines: ReadonlyArray<string>): Input {
  const left: Array<number> = [];
  const right: Array<number> = [];

  lines.forEach((l) => {
    const split = l.split(" ").filter((l) => l.trim() !== "");

    left.push(parseInt(split[0]));
    right.push(parseInt(split[1]));
  });

  return { left, right };
}

function solvePart1(input: Input): number {
  const leftSorted = input.left.toSorted((a, b) => a - b);
  const rightSorted = input.right.toSorted((a, b) => a - b);

  const differences = leftSorted
    .map((l, i) => l - rightSorted[i])
    .map((n) => Math.abs(n));

  return differences.reduce((acc, curr) => acc + curr, 0);
}

function solvePart2(input: Input): number {
  const leftIncidence = countIncidence(input.left);
  const rightIncidence = countIncidence(input.right);

  return Object.keys(leftIncidence)
    .map((l) => parseInt(l) * leftIncidence[l] * (rightIncidence[l] ?? 0))
    .reduce((sum, n) => sum + n, 0);
}

function countIncidence(nums: ReadonlyArray<number>): Record<string, number> {
  const result: Record<string, number> = {};

  nums.forEach((n) => {
    if (n in result) {
      result[n] += 1;
    } else {
      result[n] = 1;
    }
  });

  return result;
}
