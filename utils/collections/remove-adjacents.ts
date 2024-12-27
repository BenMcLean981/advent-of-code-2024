import { isEmpty } from "./array.ts";
import { EqualityChecker } from "./checkers/equality-checker.ts";

export function removeAdjacents<T>(
  items: Array<T>,
  sameItem: EqualityChecker<T>
): Array<T> {
  if (isEmpty(items)) {
    return [];
  }

  let lastUnique: T = items[0];
  const result: Array<T> = [lastUnique];

  const otherItems = items.slice(1);

  otherItems.forEach((item) => {
    const notSame = !sameItem(item, lastUnique);
    if (notSame) {
      result.push(item);
      lastUnique = item;
    }
  });

  return result;
}
