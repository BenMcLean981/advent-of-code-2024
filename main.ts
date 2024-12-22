import { solveDay10 } from "./days/day-10/index.ts";
import {
  solveDay1,
  solveDay2,
  solveDay3,
  solveDay4,
  solveDay5,
  solveDay6,
  solveDay7,
  solveDay8,
  solveDay9,
} from "./days/index.ts";

import { parseArgs } from "jsr:@std/cli/parse-args";

const day = Deno.args[0];

const flags = parseArgs(Deno.args, {
  boolean: ["sample"],
  default: { sample: false },
});

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const file = flags.sample ? "sample.txt" : "input.txt";

  console.log(`Day ${day}`);

  switch (day) {
    case "1":
      solveDay1(file);
      break;
    case "2":
      solveDay2(file);
      break;
    case "3":
      solveDay3(file);
      break;
    case "4":
      solveDay4(file);
      break;
    case "5":
      solveDay5(file);
      break;
    case "6":
      solveDay6(file);
      break;
    case "7":
      solveDay7(file);
      break;
    case "8":
      solveDay8(file);
      break;
    case "9":
      solveDay9(file);
      break;
    case "10":
      solveDay10(file);
      break;
    default:
      throw new Error(`Unsupported day "${day}".`);
  }
}
