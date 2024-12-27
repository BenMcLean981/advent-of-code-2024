import { EqualityChecker, defaultEqualityChecker } from "./equality-checker.ts";

export function contains<T>(
  arr: ReadonlyArray<T>,
  item: T,
  checker: EqualityChecker<T> = defaultEqualityChecker
): boolean {
  return arr.find((i) => checker(item, i)) !== undefined;
}
