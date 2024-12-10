import * as path from "jsr:@std/path";

import { readLines } from "../../utils.ts";

export function solveDay3(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Input = {
  lines: ReadonlyArray<string>;
};

function parseInput(lines: ReadonlyArray<string>): Input {
  return { lines };
}

function solvePart1(input: Input): number {
  const muls = input.lines.flatMap(getMulInstructions);

  return execute(muls);
}

type MulInstruction = {
  type: "Mul";
  arg0: number;
  arg1: number;
};

const mulRegex = new RegExp(/mul\(([0-9]{1,3}),([0-9]{1,3})\)/g);

function getMulInstructions(line: string): ReadonlyArray<MulInstruction> {
  return [...line.matchAll(mulRegex)].map((match) => ({
    type: "Mul",
    arg0: parseInt(match[1]),
    arg1: parseInt(match[2]),
  }));
}

function solvePart2(input: Input): number {
  const instructions = input.lines.flatMap(getInstructions);

  return execute(instructions);
}

type DoInstruction = {
  type: "Do";
};

type DontInstruction = {
  type: "Dont";
};

type Instruction = MulInstruction | DoInstruction | DontInstruction;

const instructionRegex = new RegExp(
  /((mul)\(([0-9]{1,3}),([0-9]{1,3})\))|(do\(\))|(don't\(\))/g
);

function getInstructions(line: string): ReadonlyArray<Instruction> {
  return [...line.matchAll(instructionRegex)].map(parseInstruction);
}

function parseInstruction(match: RegExpExecArray): Instruction {
  if (match[2]) {
    return { type: "Mul", arg0: parseInt(match[3]), arg1: parseInt(match[4]) };
  } else if (match[5]) {
    return { type: "Do" };
  } else if (match[6]) {
    return { type: "Dont" };
  } else {
    throw new Error("Unsupported instruction.");
  }
}

function execute(instructions: ReadonlyArray<Instruction>): number {
  let enabled = true;
  let sum = 0;

  for (const instruction of instructions) {
    switch (instruction.type) {
      case "Do":
        enabled = true;
        break;
      case "Dont":
        enabled = false;
        break;
      case "Mul":
        if (enabled) {
          sum += instruction.arg0 * instruction.arg1;
        }
    }
  }

  return sum;
}
