import * as path from "jsr:@std/path";

import { isEven, readLines } from "../../utils.ts";

export function solveDay5(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type PrintingInstruction = {
  before: number;
  after: number;
};

type Update = ReadonlyArray<number>;

type Input = {
  rules: ReadonlyArray<PrintingInstruction>;
  updates: ReadonlyArray<Update>;
};

function parseInput(lines: ReadonlyArray<string>): Input {
  const emptyLineIndex = lines.findIndex((l) => !l.includes("|"));

  const rules = lines.slice(0, emptyLineIndex).map(parseInstruction);
  const updates = lines
    .slice(emptyLineIndex)
    .map((l) => l.split(",").map((c) => parseInt(c)));

  return { rules, updates };
}

function parseInstruction(line: string): PrintingInstruction {
  const [n1, n2] = line
    .split("|")
    .filter((l) => l.trim() !== "")
    .map((c) => parseInt(c));

  return {
    before: n1,
    after: n2,
  };
}

function solvePart1(input: Input): number {
  const validUpdates = input.updates.filter((update) =>
    isUpdateInRightOrder(update, input.rules)
  );

  return validUpdates.reduce((sum, update) => sum + getMiddle(update), 0);
}

function isUpdateInRightOrder(
  update: Update,
  rules: ReadonlyArray<PrintingInstruction>
): boolean {
  return rules.every((rule) => isRuleFollowed(rule, update));
}

function isRuleFollowed(rule: PrintingInstruction, update: Update): boolean {
  const beforeIndex = update.findIndex((n) => n === rule.before);
  const afterIndex = update.findIndex((n) => n === rule.after);

  return beforeIndex === -1 || afterIndex === -1 || beforeIndex <= afterIndex;
}

function getMiddle<T>(arr: ReadonlyArray<T>): T {
  if (isEven(arr.length)) {
    throw new Error("Cannot get middle of even length array.");
  }

  return arr[Math.floor(arr.length / 2)];
}

function solvePart2(input: Input): number {
  const invalidUpdates = input.updates.filter(
    (update) => !isUpdateInRightOrder(update, input.rules)
  );

  return invalidUpdates
    .map((update) => reorder(update, input.rules))
    .reduce((sum, update) => sum + getMiddle(update), 0);
}

function reorder(
  update: Update,
  rules: ReadonlyArray<PrintingInstruction>
): Update {
  return update.toSorted((a, b) => compareWithRules(a, b, rules));
}

function compareWithRules(
  a: number,
  b: number,
  rules: ReadonlyArray<PrintingInstruction>
) {
  const goodRule = rules.find((r) => r.before === a && r.after === b);
  const badRule = rules.find((r) => r.before === b && r.after === a);

  if (goodRule !== undefined && badRule !== undefined) {
    throw new Error("Updates unsatisfiable.");
  } else if (goodRule !== undefined) {
    return -1;
  } else if (badRule !== undefined) {
    return 1;
  } else {
    return 0;
  }
}
