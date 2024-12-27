import { EqualityChecker, defaultEqualityChecker } from "./equality-checker.ts";

import { bothZeroLength, diffLength } from "../utils.ts";

export function haveSameItems<T>(
  it1: Iterable<T>,
  it2: Iterable<T>,
  check: EqualityChecker<T> = defaultEqualityChecker
): boolean {
  if (bothZeroLength<T>(it1, it2)) {
    return true;
  }

  if (diffLength<T>(it1, it2)) {
    return false;
  }

  return haveSameItems_sameLength(it1, it2, check);
}

function haveSameItems_sameLength<T>(
  it1: Iterable<T>,
  it2: Iterable<T>,
  check: EqualityChecker<T>
) {
  const arr1 = [...it1];
  let arr2 = [...it2];

  for (let i = 0; i < arr1.length; i++) {
    const item1: T = arr1[i];

    const i2 = arr2.findIndex((item2) => check(item1, item2));
    if (i2 === -1) {
      return false;
    } else {
      arr2 = remoteAtIndex(arr2, i2);
    }
  }

  return true;
}

function remoteAtIndex<T>(arr: Array<T>, i2: number): Array<T> {
  const before = arr.slice(0, i2);
  const after = arr.slice(i2 + 1);

  return [...before, ...after];
}
