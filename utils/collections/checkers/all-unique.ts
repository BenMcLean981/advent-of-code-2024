import { EqualityChecker } from "./equality-checker.ts";

export function allUnique<T>(
  items: Array<T>,
  checker: EqualityChecker<T>
): boolean {
  return items.every((item1, idx) => {
    const otherItems = items.slice(idx + 1);

    return otherItems.every((item2) => !checker(item1, item2));
  });
}
