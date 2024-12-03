import * as path from "jsr:@std/path";

import { readLines } from "../../utils.ts";

export function solveDay2(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.log("Day 1");
  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Report = {
  levels: ReadonlyArray<number>;
};

type Input = {
  reports: ReadonlyArray<Report>;
};

function parseInput(lines: ReadonlyArray<string>): Input {
  const reports = lines.map(
    (l): Report => ({
      levels: l
        .split(" ")
        .map((n) => parseInt(n))
        .filter((n) => !Number.isNaN(n)),
    })
  );

  return { reports };
}

function solvePart1(input: Input): number {
  return input.reports.filter(isSafe).length;
}

function isSafe(report: Report): boolean {
  return (
    (allAscending(report) || allDescending(report)) &&
    getMinDistance(report) >= 1 &&
    getMaxDistance(report) <= 3
  );
}

function allAscending(report: Report): boolean {
  return report.levels.every(
    (level, i, levels) => i === 0 || level >= levels[i - 1]
  );
}

function allDescending(report: Report): boolean {
  return report.levels.every(
    (level, i, levels) => i === 0 || level <= levels[i - 1]
  );
}

function getMinDistance(report: Report): number {
  return Math.min(...getDistances(report));
}

function getMaxDistance(report: Report): number {
  return Math.max(...getDistances(report));
}

function getDistances(report: Report): ReadonlyArray<number> {
  const result: Array<number> = [];

  for (let i = 1; i < report.levels.length; i++) {
    const distance = Math.abs(report.levels[i] - report.levels[i - 1]);

    result.push(distance);
  }

  return result;
}

function solvePart2(input: Input): number {
  return input.reports.filter(isSafeWithDampeners).length;
}

function isSafeWithDampeners(report: Report): boolean {
  return makePermutations(report).some(isSafe);
}

function makePermutations(report: Report): ReadonlyArray<Report> {
  return report.levels.map((_, i) => ({
    levels: removeAtIndex(report.levels, i),
  }));
}

function removeAtIndex<T>(
  arr: ReadonlyArray<T>,
  index: number
): ReadonlyArray<T> {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
