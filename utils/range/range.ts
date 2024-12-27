import { Equalable } from "../equalable.ts";
import { lessThanAndNotEqual, almostEqual } from "../equality-checks.ts";
import { TOL } from "../tol.ts";

export class Range implements Equalable {
  private readonly _lower: number;

  public get lower(): number {
    return this._lower;
  }

  private readonly _upper: number;

  public get upper(): number {
    return this._upper;
  }

  public constructor(lower: number, upper: number) {
    if (lessThanAndNotEqual(upper, lower)) {
      throw new Error("Cannot have a range where lower > upper.");
    }

    this._lower = lower;
    this._upper = upper;
  }

  public static intersection(r1: Range, r2: Range): Range | undefined {
    const lower = this.getCommonLower(r1, r2);
    const upper = this.getCommonUpper(r1, r2);

    if (lower === undefined || upper === undefined) {
      return undefined;
    } else {
      return new Range(lower, upper);
    }
  }

  private static getCommonLower(r1: Range, r2: Range): number | undefined {
    if (r1.contains(r2.lower)) {
      return r2.lower;
    } else if (r2.contains(r1.lower)) {
      return r1.lower;
    } else {
      return undefined;
    }
  }

  private static getCommonUpper(r1: Range, r2: Range): number | undefined {
    if (r1.contains(r2.upper)) {
      return r2.upper;
    } else if (r2.contains(r1.upper)) {
      return r1.upper;
    } else {
      return undefined;
    }
  }

  public get range(): number {
    return this.upper - this.lower;
  }

  public getPercentage(n: number): number {
    return (n - this.lower) / this.range;
  }

  public contains(n: number, tol = TOL): boolean {
    const lower = this.lower - tol;
    const upper = this.upper + tol;

    const aboveLower = lower <= n;
    const belowUpper = n <= upper;

    return aboveLower && belowUpper;
  }

  public equals(other: unknown, tol?: number | undefined): boolean {
    if (other instanceof Range) {
      return (
        almostEqual(this.lower, other.lower, tol) &&
        almostEqual(this.upper, other.upper, tol)
      );
    } else {
      return false;
    }
  }
}
