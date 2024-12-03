import { solveDay1, solveDay2 } from "./days/index.ts";

import { parseArgs } from "jsr:@std/cli/parse-args";

const day = Deno.args[0];

const flags = parseArgs(Deno.args, {
  boolean: ["sample"],
  default: { sample: false },
});

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const file = flags.sample ? "sample.txt" : "input.txt";

  switch (day) {
    case "1":
      solveDay1(file);
      break;
    case "2":
      solveDay2(file);
      break;
    default:
      throw new Error(`Unsupported day "${day}".`);
  }
}
