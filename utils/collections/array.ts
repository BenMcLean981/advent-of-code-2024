import { getSize, validateEnlargedIndex } from "./utils.ts";

export function isEmpty(arr: Iterable<unknown>): boolean {
  return getSize(arr) === 0;
}

export function first<T>(it: Iterable<T>): T {
  if (isEmpty(it)) {
    throw new Error("Cannot get first item of empty array.");
  }

  const arr = [...it];

  return arr[firstIndex(arr)];
}

export function last<T>(arr: ReadonlyArray<T>): T {
  return arr[lastIndex(arr)];
}

export function isFirst(idx: number, arr: ReadonlyArray<unknown>): boolean {
  if (isEmpty(arr)) {
    return false;
  }

  return idx === firstIndex(arr);
}

export function isLast(idx: number, arr: ReadonlyArray<unknown>): boolean {
  if (isEmpty(arr)) {
    return false;
  }

  return idx === lastIndex(arr);
}

export function firstIndex(arr: ReadonlyArray<unknown>): number {
  if (isEmpty(arr)) {
    throw new Error("Empty array does not have a first index.");
  }

  return 0;
}

export function lastIndex(arr: ReadonlyArray<unknown>): number {
  if (isEmpty(arr)) {
    throw new Error("Empty array does not have a first index.");
  }

  return arr.length - 1;
}

type Initializer<T> = (n: number) => T;

function isInitializer<T, G>(t: T | Initializer<G>): t is Initializer<G> {
  return typeof t === "function";
}

export function makeArray<T>(
  size: number,
  initial: T | Initializer<T>
): Array<T> {
  if (isInitializer(initial)) {
    return new Array(size).fill(undefined).map((_, n) => initial(n));
  } else {
    return new Array(size).fill(undefined).map(() => initial);
  }
}

export function insertCopy<T>(arr: Array<T>, index: number, val: T): Array<T> {
  validateEnlargedIndex(arr, index);

  const result: Array<T> = [...arr];

  insert(result, index, val);
  return result;
}

export function insert<T>(arr: Array<T>, index: number, val: T): void {
  validateEnlargedIndex(arr, index);

  arr.splice(index, 0, val);
}

export function setCopy<T>(
  arr: ReadonlyArray<T>,
  index: number,
  val: T
): Array<T> {
  validateEnlargedIndex(arr, index);

  const result: Array<T> = [...arr];

  set(result, index, val);
  return result;
}

export function set<T>(arr: Array<T>, index: number, val: T): void {
  validateEnlargedIndex(arr, index);

  arr[index] = val;
}

export function reverse<T>(arr: Array<T>): Array<T> {
  const copy = [...arr];
  copy.reverse();

  return copy;
}

export function removeIndex<T>(arr: ReadonlyArray<T>, idx: number): Array<T> {
  if (idx < 0 || idx >= arr.length) {
    throw new Error("Index out of bounds.");
  }

  return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}

export function takeWhile<T>(
  arr: ReadonlyArray<T>,
  condition: (t: T, idx: number) => boolean
): Array<T> {
  const result: Array<T> = [];

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];

    if (!condition(item, i)) {
      break;
    } else {
      result.push(item);
    }
  }

  return result;
}
