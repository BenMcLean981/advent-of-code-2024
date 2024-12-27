import { isEmpty } from "../collections/index.ts";
import { EmptyRange } from "./empty-range.ts";
import { Range } from "./range.ts";

export function makeArrayIndices(array: ReadonlyArray<unknown>): Range {
  if (isEmpty(array)) {
    return new EmptyRange();
  } else {
    return new Range(0, array.length - 1);
  }
}

export function makeEnlargedArrayIndices(array: ReadonlyArray<unknown>): Range {
  return new Range(0, array.length);
}

export function isEmptyRange(range: Range): boolean {
  return range instanceof EmptyRange;
}
