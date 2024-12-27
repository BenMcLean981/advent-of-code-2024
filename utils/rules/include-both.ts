import { Range } from "../range/range.ts";
import { TOL } from "../tol.ts";
import { Rules } from "./rules.ts";

export class IncludeBoth implements Rules {
  public readonly range: Range;

  constructor(range: Range) {
    this.range = range;
  }

  public static makeRange(lower: number, upper: number): IncludeBoth {
    const range = new Range(lower, upper);

    return new IncludeBoth(range);
  }

  public shouldInclude(n: number, tol = TOL): boolean {
    return this.range.contains(n, tol);
  }
}
