import { Range } from "../range/range.ts";
import { isEmptyRange } from "../range/utils.ts";

export class IndexError extends Error {
  constructor(index: number, range: Range) {
    super(
      isEmptyRange(range)
        ? "Tried to index an empty collection."
        : [
            "Index out of range.",
            `Expected: [${range.lower}, ${range.upper}],`,
            `received: ${index}`,
          ].join(" ")
    );
  }
}
