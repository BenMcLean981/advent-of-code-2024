import * as path from "jsr:@std/path";

import { isEven, readLines } from "../../utils.ts";
import { Block, Disk } from "./disk.ts";

export function solveDay9(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Input = {
  disk: Disk;
};

function parseInput(lines: ReadonlyArray<string>): Input {
  const sizes = lines[0].split("").map((n) => parseInt(n));

  let position = 0;
  const blocks: Array<Block> = [];

  sizes.forEach((size, index) => {
    if (!isEven(index)) {
      blocks.push({ position, size, index, id: undefined });
    } else {
      blocks.push({ position, size, index, id: index / 2 });
    }

    position += size;
  });

  const disk = new Disk(blocks);

  return { disk };
}

function solvePart1(input: Input): number {
  const fragmented = input.disk.fragment();

  return fragmented.checksum;
}

function solvePart2(input: Input): number {
  const defragmented = input.disk.defragment();

  return defragmented.checksum;
}
