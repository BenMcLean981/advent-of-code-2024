import { expect } from "jsr:@std/expect/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import { IndexError } from "../../errors/index-error.ts";
import { equalInOrder } from "../checkers/equal-in-order.ts";
import { shiftTo } from "../shift-to.ts";

describe("shiftTo", () => {
  it("Throws an IndexError for index out of range.", () => {
    expect(() => shiftTo([1, 2, 3], -1)).toThrow(IndexError);
    expect(() => shiftTo([1, 2, 3], 4)).toThrow(IndexError);
  });

  it("Does nothing for idx 0.", () => {
    const arr = [1, 2, 3];

    expect(equalInOrder(shiftTo(arr, 0), arr, areEqual)).toBe(true);
  });

  it("Shifts to the supplied index.", () => {
    const arr = [1, 2, 3];

    expect(equalInOrder(shiftTo(arr, 1), [2, 3, 1], areEqual)).toBe(true);
    expect(equalInOrder(shiftTo(arr, 2), [3, 1, 2], areEqual)).toBe(true);
  });
});

function areEqual(n1: number, n2: number): boolean {
  return n1 === n2;
}
