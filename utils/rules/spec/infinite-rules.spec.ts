import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { InfiniteRules } from "../infinite-rules.ts";

describe("InfiniteRules", () => {
  const lower = -5;
  const upper = 4;
  const range = upper - lower;

  const rules = new InfiniteRules();
  const tol = 0.01;

  describe("shouldInclude", () => {
    it("Returns true for below lower.", () => {
      expect(rules.shouldInclude(lower - 1, tol)).toBe(true);
      expect(rules.shouldInclude(lower - tol * 2, tol)).toBe(true);
    });

    it("Returns true at lower.", () => {
      expect(rules.shouldInclude(lower - tol / 2, tol)).toBe(true);
      expect(rules.shouldInclude(lower, tol)).toBe(true);
      expect(rules.shouldInclude(lower + tol / 2, tol)).toBe(true);
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

    it("Returns true at upper.", () => {
      expect(rules.shouldInclude(upper - tol / 2, tol)).toBe(true);
      expect(rules.shouldInclude(upper, tol)).toBe(true);
      expect(rules.shouldInclude(upper + tol / 2, tol)).toBe(true);
    });

    it("Returns true above upper.", () => {
      expect(rules.shouldInclude(upper + tol * 2, tol)).toBe(true);
      expect(rules.shouldInclude(upper + 1, tol)).toBe(true);
    });
  });
});
