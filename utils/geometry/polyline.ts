import { first, last, isEmpty } from "../collections/array.ts";
import { equalInOrder } from "../collections/index.ts";
import { isZero } from "../equality-checks.ts";
import { makePairs } from "../pair.ts";
import { TOL } from "../tol.ts";
import { compressLines } from "./compress-lines.ts";
import { ContainmentConfig } from "./containment-config.ts";
import { Line } from "./line.ts";
import { Xy } from "./xy.ts";

export class Polyline {
  public readonly points: Array<Xy>;

  public readonly lines: Array<Line>;

  private constructor(points: Array<Xy>, lines: Array<Line>) {
    this.points = points;
    this.lines = lines;
  }

  public get start(): Xy {
    return first(this.points);
  }

  public get end(): Xy {
    return last(this.points);
  }

  public static makeFromPoints(points: Array<Xy>): Polyline {
    const lines = makePairs(points)
      .map((p) => new Line(p[0], p[1]))
      .filter((line) => !isZero(line.length));

    if (lines.length === 0) {
      const line = new Line(points[0], points[0]);

      return Polyline.makeFromLines([line]);
    } else {
      return Polyline.makeFromLines(lines);
    }
  }

  public static makeFromLines(lines: Array<Line>): Polyline {
    if (isEmpty(lines)) {
      throw new Error("Cannot create a Polyline with no lines.");
    }

    const points = lines.map((l) => l.start);
    points.push(last(lines).end);

    return new Polyline(points, lines);
  }

  public get length(): number {
    return this.lines.reduce((length, l) => length + l.length, 0);
  }

  public compress(): Polyline {
    const compressedLines = compressLines(this.lines);

    if (compressedLines.length === 0) {
      const line = new Line(this.points[0], this.points[0]);

      return Polyline.makeFromLines([line]);
    } else {
      return Polyline.makeFromLines(compressedLines);
    }
  }

  public reverse(): Polyline {
    return Polyline.makeFromPoints(this.points.toReversed());
  }

  public translate(vec: Xy): Polyline {
    return Polyline.makeFromPoints(this.points.map((p) => p.add(vec)));
  }

  public contains(
    point: Xy,
    config: ContainmentConfig = ContainmentConfig.includeBoth()
  ): boolean {
    if (point.equals(this.start, config.tol)) {
      return config.shouldInclude(0);
    } else if (point.equals(this.end, config.tol)) {
      return config.shouldInclude(1);
    }

    return this.lines.some((l) => l.contains(point));
  }

  public equals(other: unknown, tol = TOL): boolean {
    if (other instanceof Polyline) {
      return equalInOrder(this.points, other.points, (p1, p2) =>
        p1.equals(p2, tol)
      );
    } else {
      return false;
    }
  }
}
