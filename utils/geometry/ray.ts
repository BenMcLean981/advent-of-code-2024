import { Equalable } from "../equalable.ts";
import { isZero } from "../equality-checks.ts";
import { Xy } from "./xy.ts";

export class Ray implements Equalable {
  public readonly root: Xy;

  public readonly axis: Xy;

  public constructor(root: Xy, axis: Xy) {
    if (isZero(axis.magnitude)) {
      throw new Error("Cannot create zero length ray.");
    }

    this.root = root;
    this.axis = axis;
  }

  public getClosestPoint(xy: Xy) {
    const scale = this.getScale(xy);

    return this.root.add(this.axis.scale(scale));
  }

  /**
   * Returns how far along axis the projection of point is.
   */
  public getScale(point: Xy): number {
    const toPoint = Xy.makeDelta(this.root, point);
    return toPoint.dot(this.axis) / this.axis.dot(this.axis);
  }

  public equals(other: unknown, tol?: number | undefined): boolean {
    if (other instanceof Ray) {
      return (
        this.root.equals(other.root, tol) && this.axis.equals(other.axis, tol)
      );
    } else {
      return false;
    }
  }
}
