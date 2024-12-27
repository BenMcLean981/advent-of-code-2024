export type Pair<T> = [T, T];

export function makeAllPairs<T>(items: Iterable<T>): ReadonlyArray<Pair<T>> {
  return [...items].flatMap((item1) =>
    [...items].map((item2): Pair<T> => [item1, item2])
  );
}

export function makePairs<T>(items: Iterable<T>): ReadonlyArray<Pair<T>> {
  const arr = [...items];

  if (arr.length === 1) {
    throw new Error("Cannot make pairs with one item.");
  }

  const results: Array<Pair<T>> = [];

  for (let i = 0; i < arr.length - 1; i++) {
    const pair: Pair<T> = [arr[i], arr[i + 1]];
    results.push(pair);
  }

  return results;
}
