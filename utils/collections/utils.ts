import { IndexError } from "../errors/index-error.ts";
import { makeArrayIndices, makeEnlargedArrayIndices } from "../range/utils.ts";

export function diffLength<T>(it1: Iterable<T>, it2: Iterable<T>) {
  return getSize(it1) !== getSize(it2);
}

export function bothZeroLength<T>(it1: Iterable<T>, it2: Iterable<T>) {
  return getSize(it1) === 0 && getSize(it2) === 0;
}

export function getSize(it: Iterable<unknown>): number {
  return [...it].length;
}

export function validateIndex(
  array: ReadonlyArray<unknown>,
  index: number
): void {
  const range = makeArrayIndices(array);

  if (!range.contains(index)) {
    throw new IndexError(index, range);
  }
}

export function validateEnlargedIndex(
  array: ReadonlyArray<unknown>,
  index: number
): void {
  const range = makeEnlargedArrayIndices(array);

  if (!range.contains(index)) {
    throw new IndexError(index, range);
  }
}
