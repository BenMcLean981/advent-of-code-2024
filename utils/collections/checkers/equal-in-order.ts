import { bothZeroLength, diffLength } from "../utils.ts";
import { EqualityChecker, defaultEqualityChecker } from "./equality-checker.ts";

export function equalInOrder<T>(
  it1: Iterable<T>,
  it2: Iterable<T>,
  areEqual: EqualityChecker<T> = defaultEqualityChecker
): boolean {
  const arr1 = [...it1];
  const arr2 = [...it2];

  if (bothZeroLength(arr1, arr2)) {
    return true;
  }

  if (diffLength(arr1, arr2)) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const item1 = arr1[i];
    const item2 = arr2[i];

    if (!areEqual(item1, item2)) {
      return false;
    }
  }

  return true;
}
