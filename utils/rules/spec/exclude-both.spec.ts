import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { ExcludeBoth } from "../exclude-both.ts";

describe("ExcludeBoth", () => {
  const lower = -5;
  const upper = 4;
  const range = upper - lower;

  const rules = ExcludeBoth.makeRange(lower, upper);
  const tol = 0.01;

  describe("shouldInclude", () => {
    it("Returns false for below lower.", () => {
      expect(rules.shouldInclude(lower - 1, tol)).toBe(false);
      expect(rules.shouldInclude(lower - tol * 2, tol)).toBe(false);
    });

    it("Returns false at lower.", () => {
      expect(rules.shouldInclude(lower - tol / 2, tol)).toBe(false);
      expect(rules.shouldInclude(lower, tol)).toBe(false);
      expect(rules.shouldInclude(lower + tol / 2, tol)).toBe(false);
    });

    it("Returns true between lower and upper.", () => {
      expect(rules.shouldInclude(lower + tol * 2, tol)).toBe(true);

      expect(rules.shouldInclude(lower + range * 0.1, tol)).toBe(true);
      expect(rules.shouldInclude(lower + range * 0.2, tol)).toBe(true);
      expect(rules.shouldInclude(lower + range * 0.5, tol)).toBe(true);
      expect(rules.shouldInclude(lower + range * 0.8, tol)).toBe(true);
      expect(rules.shouldInclude(lower + range * 0.9, tol)).toBe(true);

      expect(rules.shouldInclude(upper - tol * 2, tol)).toBe(true);
    });

    it("Returns false at upper.", () => {
      expect(rules.shouldInclude(upper - tol / 2, tol)).toBe(false);
      expect(rules.shouldInclude(upper, tol)).toBe(false);
      expect(rules.shouldInclude(upper + tol / 2, tol)).toBe(false);
    });

    it("Returns false above upper.", () => {
      expect(rules.shouldInclude(upper + tol * 2, tol)).toBe(false);
      expect(rules.shouldInclude(upper + 1, tol)).toBe(false);
    });
  });
});
