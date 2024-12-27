import { almostEqual } from "../equality-checks.ts";
import { Range } from "../range/range.ts";
import { TOL } from "../tol.ts";
import { Rules } from "./rules.ts";

export class ExcludeUpper implements Rules {
  public readonly range: Range;

  constructor(range: Range) {
    this.range = range;
  }

  public static makeRange(lower: number, upper: number): ExcludeUpper {
    const range = new Range(lower, upper);

    return new ExcludeUpper(range);
  }

  public shouldInclude(n: number, tol = TOL): boolean {
    const equalsUpper = almostEqual(this.range.upper, n, tol);

    if (equalsUpper) {
      return false;
    } else {
      return this.range.contains(n, tol);
    }
  }
}
