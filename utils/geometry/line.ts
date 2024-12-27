import { TOL } from "../tol.ts";
import { ContainmentConfig } from "./containment-config.ts";
import { Ray } from "./ray.ts";
import { Xy } from "./xy.ts";

export class Line {
  public readonly start: Xy;

  public readonly end: Xy;

  constructor(start: Xy, end: Xy) {
    this.start = start;
    this.end = end;
  }

  public get slope(): Xy {
    return Xy.makeDelta(this.start, this.end);
  }

  public get length(): number {
    return this.slope.magnitude;
  }

  public contains(
    xy: Xy,
    config: ContainmentConfig = ContainmentConfig.includeBoth()
  ): boolean {
    const ray = new Ray(this.start, this.slope);
    const projected = ray.getClosestPoint(xy);

    const onLine = projected.getDistance(xy) < config.tol;
    if (!onLine) {
      return false;
    }

    const scale = ray.getScale(projected);

    return config.shouldInclude(scale);
  }

  public toString(): string {
    return `${this.start.toString()} - ${this.end.toString()}`;
  }

  public equals(other: unknown, tol = TOL): boolean {
    if (other instanceof Line) {
      return (
        this.start.equals(other.start, tol) && this.end.equals(other.end, tol)
      );
    } else {
      return false;
    }
  }
}
