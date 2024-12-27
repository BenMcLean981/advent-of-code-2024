import { expect } from "jsr:@std/expect/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import { IndexError } from "../../errors/index-error.ts";
import {
  isEmpty,
  first,
  last,
  isFirst,
  isLast,
  firstIndex,
  lastIndex,
  makeArray,
  insertCopy,
  insert,
  setCopy,
  set,
  reverse,
  removeIndex,
  takeWhile,
} from "../array.ts";
import { allUnique } from "../checkers/all-unique.ts";
import { equalInOrder } from "../checkers/equal-in-order.ts";

describe("isEmpty", () => {
  it("Returns true for empty.", () => {
    expect(isEmpty([])).toBe(true);
  });

  it("Returns false for not empty.", () => {
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty([1, 2, 3])).toBe(false);
  });
});

describe("first", () => {
  it("Throws an error for an empty array.", () => {
    expect(() => first([])).toThrow();
  });

  it("Returns the first item in an array with one item.", () => {
    expect(first([2])).toBe(2);
  });

  it("Returns the first item in an array with multiple items.", () => {
    expect(first([2, 3, -2])).toBe(2);
  });
});

describe("last", () => {
  it("Throws an error for an empty array.", () => {
    expect(() => last([])).toThrow();
  });

  it("Returns the last item in the array.", () => {
    expect(last([2])).toBe(2);
    expect(last([1, -2, 2])).toBe(2);
  });
});

describe("isFirst", () => {
  it("Returns false for an empty list.", () => {
    const arr: unknown[] = [];

    expect(isFirst(0.5, arr)).toBe(false);
    expect(isFirst(1, arr)).toBe(false);
    expect(isFirst(2, arr)).toBe(false);
    expect(isFirst(-1, arr)).toBe(false);
    expect(isFirst(Infinity, arr)).toBe(false);
    expect(isFirst(0, arr)).toBe(false);
  });

  it("Returns false for anything but zero.", () => {
    const arr = ["foo"];

    expect(isFirst(0, arr)).toBe(true);

    expect(isFirst(0.5, arr)).toBe(false);
    expect(isFirst(1, arr)).toBe(false);
    expect(isFirst(2, arr)).toBe(false);
    expect(isFirst(-1, arr)).toBe(false);
    expect(isFirst(Infinity, arr)).toBe(false);
  });
});

describe("isLast", () => {
  it("Returns false all numbers on an empty list.", () => {
    const arr: unknown[] = [];

    expect(isLast(0, arr)).toBe(false);
    expect(isLast(1, arr)).toBe(false);
    expect(isLast(-1, arr)).toBe(false);
    expect(isLast(0.5, arr)).toBe(false);
  });

  it("Returns true for length - 1.", () => {
    const arr = [1, 2, 3];

    expect(isLast(2, arr)).toBe(true);

    expect(isLast(2.5, arr)).toBe(false);
    expect(isLast(1.5, arr)).toBe(false);
    expect(isLast(0, arr)).toBe(false);
    expect(isLast(-2, arr)).toBe(false);
  });
});

describe("firstIndex", () => {
  it("Throws an error for an empty array.", () => {
    expect(() => firstIndex([])).toThrow();
  });

  it("Returns 0 for an array with one item.", () => {
    expect(firstIndex([1])).toBe(0);
  });

  it("Returns 0 for an array with multiple items.", () => {
    expect(firstIndex([1, 2, 3])).toBe(0);
  });
});

describe("lastIndex", () => {
  it("Throws an error for an empty array.", () => {
    expect(() => lastIndex([])).toThrow();
  });

  it("Returns 0 for an array with one item.", () => {
    expect(lastIndex([1])).toBe(0);
  });

  it("Returns length - 1 for an array with multiple items.", () => {
    expect(lastIndex([1, 2, 3])).toBe(2);
  });
});

describe("makeArray", () => {
  it("Makes an array with an initial primitive value.", () => {
    const arr = makeArray(5, true);

    expect(arr.length).toBe(5);
    expect(arr.every((item) => item)).toBe(true);
  });

  it("Makes an array with an initial referenced value.", () => {
    const initial: unknown[] = [];
    const arr = makeArray(5, initial);

    expect(arr.length).toBe(5);
    expect(arr.every((item) => item === initial)).toBe(true);
  });

  it("Makes an array with an initializer function.", () => {
    const arr = makeArray(5, () => []);

    expect(arr.length).toBe(5);
    expect(arr.every((arr) => isEmpty(arr))).toBe(true);
    expect(allUnique(arr, (a, b) => a === b)).toBe(true);
  });

  it("Makes an array using the number provided by the initializer.", () => {
    const actual = makeArray(5, (n) => n);
    const expected = [0, 1, 2, 3, 4];

    expect(equalInOrder(expected, actual)).toBe(true);
  });
});

describe("insertCopy", () => {
  it("Throws an IndexError for index too small.", () => {
    expect(() => insertCopy([1, 2, 3], -1, 3)).toThrow(IndexError);
  });

  it("Throws an IndexError for index too large.", () => {
    expect(() => insertCopy([1, 2, 3], 4, 3)).toThrow(IndexError);
  });

  it("Inserts the value in the array without changing the original.", () => {
    const arr = [1, 2, 3];

    expectDoesNotChangeOriginal(arr, [1, 0, 2, 3], () => insertCopy(arr, 1, 0));
  });

  it("Inserts the value at 0.", () => {
    const arr = [1, 2, 3];

    expectDoesNotChangeOriginal(arr, [0, 1, 2, 3], () => insertCopy(arr, 0, 0));
  });

  it("Inserts the value after the end.", () => {
    const arr = [1, 2, 3];

    expectDoesNotChangeOriginal(arr, [1, 2, 3, 0], () => insertCopy(arr, 3, 0));
  });
});

describe("insert", () => {
  it("Throws an IndexError for index too small.", () => {
    expect(() => insert([1, 2, 3], -1, 3)).toThrow(IndexError);
  });

  it("Throws an IndexError for index too large.", () => {
    expect(() => insert([1, 2, 3], 4, 3)).toThrow(IndexError);
  });

  it("Inserts a value at 0.", () => {
    const arr = [1, 2, 3];
    insert(arr, 0, 0);

    expect(equalInOrder([0, 1, 2, 3], arr, areEqual)).toBe(true);
  });

  it("Inserts a value at an intermediate index.", () => {
    const arr = [1, 2, 3];
    insert(arr, 2, 0);

    expect(equalInOrder([1, 2, 0, 3], arr, areEqual)).toBe(true);
  });

  it("Inserts a value after the end.", () => {
    const arr = [1, 2, 3];
    insert(arr, 3, 0);

    expect(equalInOrder([1, 2, 3, 0], arr, areEqual)).toBe(true);
  });
});

describe("setCopy", () => {
  it("Throws an IndexError for index too small.", () => {
    expect(() => setCopy([1, 2, 3], -1, 3)).toThrow(IndexError);
  });

  it("Throws an IndexError for index too large.", () => {
    expect(() => setCopy([1, 2, 3], 4, 3)).toThrow(IndexError);
  });

  it("Sets the value in the array without changing the original.", () => {
    const arr = [1, 2, 3];

    expectDoesNotChangeOriginal(arr, [1, 0, 3], () => setCopy(arr, 1, 0));
  });

  it("Sets the value at 0.", () => {
    const arr = [1, 2, 3];

    expectDoesNotChangeOriginal(arr, [0, 2, 3], () => setCopy(arr, 0, 0));
  });

  it("Sets the value at the end.", () => {
    const arr = [1, 2, 3];

    expectDoesNotChangeOriginal(arr, [1, 2, 0], () => setCopy(arr, 2, 0));
  });

  it("Sets the value after the end.", () => {
    const arr = [1, 2, 3];

    expectDoesNotChangeOriginal(arr, [1, 2, 3, 0], () => setCopy(arr, 3, 0));
  });
});

describe("set", () => {
  it("Throws an IndexError for index too small.", () => {
    expect(() => set([1, 2, 3], -1, 3)).toThrow(IndexError);
  });

  it("Throws an IndexError for index too large.", () => {
    expect(() => set([1, 2, 3], 4, 3)).toThrow(IndexError);
  });

  it("Sets a value at 0.", () => {
    const arr = [1, 2, 3];
    set(arr, 0, 0);

    expect(equalInOrder([0, 2, 3], arr, areEqual)).toBe(true);
  });

  it("Sets a value at an intermediate index.", () => {
    const arr = [1, 2, 3];
    set(arr, 1, 0);

    expect(equalInOrder([1, 0, 3], arr, areEqual)).toBe(true);
  });

  it("Sets a value at the end.", () => {
    const arr = [1, 2, 3];
    set(arr, 2, 0);

    expect(equalInOrder([1, 2, 0], arr, areEqual)).toBe(true);
  });

  it("Sets a value after the end.", () => {
    const arr = [1, 2, 3];
    set(arr, 3, 0);

    expect(equalInOrder([1, 2, 3, 0], arr, areEqual)).toBe(true);
  });
});

describe("reverse", () => {
  it("Creates a new reversed array.", () => {
    expectDoesNotChangeOriginal([1, 2, 3], [3, 2, 1], (a) => reverse(a));
  });
});

describe("removeIndex", () => {
  it("Throws an error for out of bounds.", () => {
    const arr = [1, 3, 4];

    expect(() => removeIndex(arr, -1)).toThrow();
    expect(() => removeIndex(arr, 3)).toThrow();
  });

  it("Removes the item at the first index.", () => {
    const arr = [1, 3, 4];

    const actual = removeIndex(arr, 0);

    expect(equalInOrder([3, 4], actual)).toBe(true);
  });

  it("Removes the item at the last index.", () => {
    const arr = [1, 3, 4];

    const actual = removeIndex(arr, 2);

    expect(equalInOrder([1, 3], actual)).toBe(true);
  });

  it("Removes an item at an intermediate index.", () => {
    const arr = [1, 3, 4];

    const actual = removeIndex(arr, 1);

    expect(equalInOrder([1, 4], actual)).toBe(true);
  });
});

function expectDoesNotChangeOriginal(
  arr: number[],
  expected: number[],
  action: (arr: number[]) => number[]
) {
  const copy = [...arr];
  const actual = action(arr);

  expect(equalInOrder(expected, actual, areEqual)).toBe(true);
  expect(equalInOrder(copy, arr, areEqual)).toBe(true);
}

function areEqual(n1: number, n2: number): boolean {
  return n1 === n2;
}

describe("takeWhile", () => {
  it("Takes the items of the array in order that they meet the condition.", () => {
    const arr = [1, 2, 3, 4, -1, -2, 10];

    const actual = takeWhile(arr, (c) => c > 0);
    const expected = [1, 2, 3, 4];

    expect(equalInOrder(expected, actual)).toBe(true);
  });

  it("Does nothing to an empty array.", () => {
    const actual = takeWhile([], (c) => c > 0);

    expect(isEmpty(actual));
  });
});
