import { expect } from "jsr:@std/expect/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import { equalInOrder } from "../equal-in-order.ts";

const areEqual = (n1: number, n2: number) => n1 === n2;

describe("equalInOrder", () => {
  it("Returns true for both of zero length.", () => {
    expect(equalInOrder([], [], areEqual)).toBe(true);
  });

  it("Returns false for different lengths.", () => {
    expect(equalInOrder([], [1], areEqual)).toBe(false);
    expect(equalInOrder([1], [], areEqual)).toBe(false);
  });

  it("Returns false for not equal in order.", () => {
    expect(equalInOrder([1, 2, 3], [3, 2, 1], areEqual)).toBe(false);
  });

  it("Returns true for equal in order.", () => {
    expect(equalInOrder([1, 2, 3], [1, 2, 3], areEqual)).toBe(true);
  });
});
