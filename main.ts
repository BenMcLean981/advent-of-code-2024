import {
  solveDay1,
  solveDay11,
  solveDay12,
  solveDay13,
  solveDay14,
  solveDay15,
  solveDay16,
  solveDay17,
  solveDay18,
  solveDay19,
  solveDay2,
  solveDay20,
  solveDay21,
  solveDay22,
  solveDay23,
  solveDay24,
  solveDay25,
  solveDay3,
  solveDay4,
  solveDay5,
  solveDay6,
  solveDay10,
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
    case "11":
      solveDay11(file);
      break;
    case "12":
      solveDay12(file);
      break;
    case "13":
      solveDay13(file);
      break;
    case "14":
      solveDay14(file);
      break;
    case "15":
      solveDay15(file);
      break;
    case "16":
      solveDay16(file);
      break;
    case "17":
      solveDay17(file);
      break;
    case "18":
      solveDay18(file);
      break;
    case "19":
      solveDay19(file);
      break;
    case "20":
      solveDay20(file);
      break;
    case "21":
      solveDay21(file);
      break;
    case "22":
      solveDay22(file);
      break;
    case "23":
      solveDay23(file);
      break;
    case "24":
      solveDay24(file);
      break;
    case "25":
      solveDay25(file);
      break;
    default:
      throw new Error(`Unsupported day "${day}".`);
  }
}
