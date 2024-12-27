import { expect } from "jsr:@std/expect/expect";
import { describe, beforeEach, it } from "jsr:@std/testing/bdd";
import { TOL } from "../../tol.ts";
import { Range } from "../range.ts";

describe("Range", () => {
  const lower = 4;
  const upper = 9;

  let range: Range;

  beforeEach(() => {
    range = new Range(lower, upper);
  });

  describe("constructor", () => {
    it("Throws an error for upper < lower.", () => {
      expect(() => new Range(4, 0)).toThrow();
    });

    it("Throws no error for upper < lower within tol.", () => {
      expect(() => new Range(0, -1e-10)).not.toThrow();
    });

    it("Sets lower, upper, and range.", () => {
      const range = new Range(lower, upper);

      expect(range.lower).toBe(lower);
      expect(range.upper).toBe(upper);
      expect(range.range).toBeCloseTo(5, TOL);
    });
  });

  describe("intersection", () => {
    it("Returns first when first is subset of second.", () => {
      const sub = new Range(2, 3);
      const sup = new Range(1, 4);

      const actual = Range.intersection(sub, sup);

      expect(sub.equals(actual)).toBe(true);
    });

    it("Returns second when second is subset of first.", () => {
      const sub = new Range(2, 3);
      const sup = new Range(1, 4);

      const actual = Range.intersection(sup, sub);

      expect(sub.equals(actual)).toBe(true);
    });

    it("Returns common to both when second above first.", () => {
      const lower = new Range(1, 4);
      const upper = new Range(3, 5);

      const actual = Range.intersection(lower, upper);
      const expected = new Range(upper.lower, lower.upper);

      expect(expected.equals(actual)).toBe(true);
    });

    it("Returns common to both when second below first.", () => {
      const lower = new Range(1, 4);
      const upper = new Range(0, 2);

      const actual = Range.intersection(lower, upper);
      const expected = new Range(lower.lower, upper.upper);

      expect(expected.equals(actual)).toBe(true);
    });

    it("Returns common to both when first above second.", () => {
      const lower = new Range(1, 4);
      const upper = new Range(3, 5);

      const actual = Range.intersection(upper, lower);
      const expected = new Range(upper.lower, lower.upper);

      expect(expected.equals(actual)).toBe(true);
    });

    it("Returns common to both when first below second.", () => {
      const lower = new Range(1, 4);
      const upper = new Range(0, 2);

      const actual = Range.intersection(upper, lower);
      const expected = new Range(lower.lower, upper.upper);

      expect(expected.equals(actual)).toBe(true);
    });

    it("Returns first's upper when second only touches at upper.", () => {
      const first = new Range(1, 4);
      const second = new Range(4, 5);

      const actual = Range.intersection(first, second);
      const expected = new Range(first.upper, first.upper);

      expect(expected.equals(actual)).toBe(true);
    });

    it("Returns first's lower when second only touches at lower.", () => {
      const first = new Range(4, 5);
      const second = new Range(1, 4);

      const actual = Range.intersection(first, second);
      const expected = new Range(second.upper, second.upper);

      expect(expected.equals(actual)).toBe(true);
    });

    it("Returns undefined for no overlap.", () => {
      const base = new Range(-1, 2);

      expect(Range.intersection(base, new Range(3, 4))).toBeUndefined();
      expect(Range.intersection(base, new Range(-3, -2))).toBeUndefined();
    });
  });

  describe("contains", () => {
    it("Returns true for within tol.", () => {
      const range = new Range(-4, 5);

      const tol = 0.01;
      expect(range.contains(-5, tol)).toBe(false);
      expect(range.contains(-4.02, tol)).toBe(false);
      expect(range.contains(-4.005, tol)).toBe(true);
      expect(range.contains(-4, tol)).toBe(true);
      expect(range.contains(-3.99, tol)).toBe(true);
      expect(range.contains(-2, tol)).toBe(true);

      expect(range.contains(0, tol)).toBe(true);

      expect(range.contains(2, tol)).toBe(true);
      expect(range.contains(4.99, tol)).toBe(true);
      expect(range.contains(5, tol)).toBe(true);
      expect(range.contains(5.005, tol)).toBe(true);
      expect(range.contains(5.02, tol)).toBe(false);
    });
  });

  describe("getPercentage.", () => {
    it("Returns negative percentage below lower.", () => {
      const expected = -2.5;
      const val = lower + range.range * expected;

      expect(range.getPercentage(val)).toBeCloseTo(expected, TOL);
    });

    it("Returns 0 for lower.", () => {
      expect(range.getPercentage(lower)).toBeCloseTo(0, TOL);
    });

    it("Returns percentage between lower and upper.", () => {
      const expected = 0.6;
      const val = lower + range.range * expected;

      expect(range.getPercentage(val)).toBeCloseTo(expected, TOL);
    });

    it("Returns 1 for upper.", () => {
      expect(range.getPercentage(upper)).toBeCloseTo(1, TOL);
    });

    it("Returns positive percentage above upper.", () => {
      const expected = 2.5;
      const val = lower + range.range * expected;

      expect(range.getPercentage(val)).toBeCloseTo(expected, TOL);
    });
  });

  describe("equals", () => {
    let r: Range;

    beforeEach(() => {
      r = new Range(-1, 3);
    });

    it("Returns true for equal.", () => {
      const other = new Range(r.lower, r.upper);

      expect(r.equals(other)).toBe(true);
    });

    it("Returns false for different lowers.", () => {
      const other = new Range(r.lower - 1, r.upper);

      expect(r.equals(other)).toBe(false);
    });

    it("Returns false for different uppers.", () => {
      const other = new Range(r.lower, r.upper + 1);

      expect(r.equals(other)).toBe(false);
    });

    it("Returns false for different types.", () => {
      expect(r.equals(0)).toBe(false);
    });
  });
});
