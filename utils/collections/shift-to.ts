import { validateIndex } from "./utils.ts";

export function shiftTo<T>(array: Array<T>, index: number): Array<T> {
  validateIndex(array, index);

  const afterIndex = array.slice(index);
  const beforeIndex = array.slice(0, index);

  return [...afterIndex, ...beforeIndex];
}
