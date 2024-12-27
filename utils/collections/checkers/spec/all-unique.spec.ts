import { expect } from "jsr:@std/expect/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import { allUnique } from "../all-unique.ts";

describe("allUnique", () => {
  it("Returns true for an empty array.", () => {
    expect(allUnique([], (a, b) => a === b)).toBe(true);
  });

  it("Returns true for one item.", () => {
    expect(allUnique([1], (a, b) => a === b)).toBe(true);
  });

  it("Returns false for not unique.", () => {
    expect(allUnique([1, 1], (a, b) => a === b)).toBe(false);
    expect(allUnique([1, 2, 3, 1, 4, 5], (a, b) => a === b)).toBe(false);
  });

  it("Returns true for all unique.", () => {
    expect(allUnique([1, 2, 3, 4], (a, b) => a === b)).toBe(true);
    expect(allUnique([5, -2, 1, 0, 2], (a, b) => a === b)).toBe(true);
  });
});
