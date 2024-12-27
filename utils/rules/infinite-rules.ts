import { almostEqual } from "../equality-checks.ts";
import { Range } from "../range/range.ts";
import { TOL } from "../tol.ts";
import { Rules } from "./rules.ts";

export class InfiniteRules implements Rules {
  public readonly range: Range;

  constructor() {
    this.range = new Range(-Infinity, Infinity);
  }

  public shouldInclude(n: number, tol = TOL): boolean {
    const equalsLower = almostEqual(this.range.lower, n);

    if (equalsLower) {
      return false;
    } else {
      return this.range.contains(n, tol);
    }
  }
}
