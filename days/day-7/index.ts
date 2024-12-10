import * as path from "jsr:@std/path";

import { readLines } from "../../utils.ts";

export function solveDay7(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.warn(
    "This is slow (1 min), but not so slow that I'm going to fix it."
  );
  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Input = {
  equations: ReadonlyArray<Equation>;
};

type Equation = {
  testValue: number;
  terms: ReadonlyArray<number>;
};

function parseInput(lines: ReadonlyArray<string>): Input {
  const equations = lines.map(parseEquation);

  return { equations };
}

function parseEquation(line: string): Equation {
  const [left, right] = line.split(":").filter((s) => s.trim() !== "");

  return {
    testValue: parseInt(left),
    terms: right
      .split(" ")
      .filter((s) => s.trim() !== "")
      .map((s) => parseInt(s)),
  };
}

type Symbol = "+" | "*" | "||";

function solvePart1(input: Input): number {
  const satisfiable = input.equations.filter((e) => isSolvable(e, ["+", "*"]));

  return satisfiable.reduce((sum, e) => sum + e.testValue, 0);
}

function isSolvable(
  equation: Equation,
  symbols: ReadonlyArray<Symbol>
): boolean {
  return getPotentialResults(equation.terms, symbols).some(
    (n) => n === equation.testValue
  );
}

function getPotentialResults(
  terms: ReadonlyArray<number>,
  symbols: ReadonlyArray<Symbol>,
  result: number = 0
): ReadonlyArray<number> {
  if (terms.length === 0) {
    return [result];
  }

  return symbols.flatMap((symbol) =>
    getPotentialResults(
      terms.slice(1),
      symbols,
      process(symbol, result, terms[0])
    )
  );
}

function process(symbol: Symbol, n1: number, n2: number): number {
  switch (symbol) {
    case "+":
      return n1 + n2;
    case "*":
      return n1 * n2;
    case "||":
      return parseInt(`${n1}${n2}`);
  }
}

function solvePart2(input: Input): number {
  const satisfiable = input.equations.filter((e) =>
    isSolvable(e, ["+", "*", "||"])
  );

  return satisfiable.reduce((sum, e) => sum + e.testValue, 0);
}
