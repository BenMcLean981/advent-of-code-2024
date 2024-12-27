import { almostEqual } from "../equality-checks.ts";
import { TOL } from "../tol.ts";

export const TWO_PI = Math.PI * 2;

export class Angle {
  private readonly rads: number;

  private constructor(rads: number) {
    this.rads = rads;
  }

  public get radians(): number {
    return this.rads;
  }

  public get degrees(): number {
    return (this.rads * 180) / Math.PI;
  }

  public static makeDegrees(degrees: number): Angle {
    return new Angle((degrees / 180) * Math.PI);
  }

  public static makeRadians(rads: number): Angle {
    return new Angle(rads);
  }

  public get sin(): number {
    return Math.sin(this.radians);
  }

  public get cos(): number {
    return Math.cos(this.radians);
  }

  public normalize(): Angle {
    return new Angle(this.rads % TWO_PI);
  }

  public normalizePositive(): Angle {
    return new Angle(normalizeRadiansPositive(this.rads));
  }

  public add(other: Angle): Angle {
    return new Angle(this.rads + other.rads);
  }

  public subtract(other: Angle): Angle {
    return new Angle(this.rads - other.rads);
  }

  public scale(n: number): Angle {
    return new Angle(this.rads * n);
  }

  public isParallel(angle: Angle, tol = TOL): boolean {
    return this.areColinear(angle, tol) || this.areColinear(this.flip(angle));
  }

  private flip(angle: Angle): Angle {
    return angle.add(Angle.makeDegrees(180));
  }

  public areColinear(angle: Angle, tol = TOL): boolean {
    const thisNorm = this.normalizePositive();
    const otherNorm = angle.normalizePositive();

    return (
      thisNorm.equals(otherNorm, tol) ||
      this.areColinearAroundZero(thisNorm, otherNorm, tol) ||
      this.areColinearAroundZero(otherNorm, thisNorm, tol)
    );
  }

  private areColinearAroundZero(
    thisNorm: Angle,
    otherNorm: Angle,
    tol: number
  ): boolean {
    return (
      thisNorm.equals(Angle.makeDegrees(0), tol) &&
      otherNorm.equals(Angle.makeDegrees(360), tol)
    );
  }

  public getSweepCcw(other: Angle): Angle {
    return other.subtract(this).normalizePositive();
  }

  public getSweepCw(other: Angle): Angle {
    return this.subtract(other).normalizePositive();
  }

  public equals(angle: Angle, tol = TOL): boolean {
    return almostEqual(this.rads, angle.rads, tol);
  }
}

function normalizeRadiansPositive(rads: number): number {
  const normed = rads % TWO_PI;

  if (normed < 0) {
    return normed + TWO_PI;
  } else {
    return normed;
  }
}
