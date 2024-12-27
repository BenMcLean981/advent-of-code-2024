import { almostEqual } from "../equality-checks.ts";
import { Range } from "../range/range.ts";
import { TOL } from "../tol.ts";
import { Rules } from "./rules.ts";

export class ExcludeBoth implements Rules {
  public readonly range: Range;

  constructor(range: Range) {
    this.range = range;
  }

  public static makeRange(lower: number, upper: number): ExcludeBoth {
    const range = new Range(lower, upper);

    return new ExcludeBoth(range);
  }

  public shouldInclude(n: number, tol = TOL): boolean {
    const equalsLower = almostEqual(this.range.lower, n, tol);
    const equalsUpper = almostEqual(this.range.upper, n, tol);

    if (equalsLower || equalsUpper) {
      return false;
    } else {
      return this.range.contains(n, tol);
    }
  }
}
