import { isEmpty, last } from "../collections/array.ts";
import { equalInOrderCircular } from "../collections/index.ts";
import { Equalable } from "../equalable.ts";
import { isZero } from "../equality-checks.ts";
import { makePairs } from "../pair.ts";
import { TOL } from "../tol.ts";
import { compressLines } from "./compress-lines.ts";
import { Line } from "./line.ts";
import { Polyline } from "./polyline.ts";
import { Xy } from "./xy.ts";

export class Polygon implements Equalable {
  public readonly points: Array<Xy>;

  private constructor(points: Array<Xy>) {
    this.points = points;

    if (this.points.length < 4) {
      throw new Error("Cannot make a Polygon with less than four points.");
    }

    if (!this.points[0].equals(last(this.points))) {
      throw new Error("Polygon must be closed.");
    }
  }

  public static makeFromPoints(points: Array<Xy>): Polygon {
    const lines = makePairs(points)
      .map((p) => new Line(p[0], p[1]))
      .filter((line) => !isZero(line.length));

    if (lines.length === 0) {
      const line = new Line(points[0], points[0]);

      return Polygon.makeFromLines([line]);
    } else {
      return Polygon.makeFromLines(lines);
    }
  }

  public static makeFromLines(lines: Array<Line>): Polygon {
    if (isEmpty(lines)) {
      throw new Error("Cannot create a Polygon with no lines.");
    }

    const points = lines.map((l) => l.start);
    points.push(last(lines).end);

    return new Polygon(points);
  }

  public compress(): Polygon {
    return Polygon.makeFromLines(compressLines(this.lines));
  }

  public get lines(): Array<Line> {
    const polyline = Polyline.makeFromPoints(this.points);
    return polyline.lines;
  }

  public equals(other: unknown, tol = TOL): boolean {
    if (other instanceof Polygon) {
      // drop first points, polygons require last to be equal to first.

      const pts = this.points.slice(1);
      const otherPts = other.points.slice(1);

      return equalInOrderCircular(pts, otherPts, (p1, p2) =>
        p1.equals(p2, tol)
      );
    } else {
      return false;
    }
  }
}
