export type Pair<T> = [T, T];

export function makeAllPairs<T>(items: Iterable<T>): ReadonlyArray<Pair<T>> {
  return [...items].flatMap((item1) =>
    [...items].map((item2): Pair<T> => [item1, item2])
  );
}
