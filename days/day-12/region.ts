import { Polygon } from "../../utils/geometry/polygon.ts";
import { Line } from "../../utils/geometry/line.ts";
import { orthogonalDirections, Xy } from "../../utils/geometry/xy.ts";
import { connectLines } from "../../utils/geometry/connect-lines.ts";
import { Polyline } from "../../utils/geometry/polyline.ts";

export class Region {
  private readonly _plant: string;

  private readonly _positions: ReadonlyArray<Xy>;

  private readonly _positionSet: Set<string>;

  public constructor(plant: string, positions: ReadonlyArray<Xy>) {
    this._plant = plant;
    this._positions = positions;
    this._positionSet = new Set(positions.map((p) => p.hash()));
  }

  public get plant(): string {
    return this._plant;
  }

  public get area(): number {
    return this._positions.length;
  }

  public get perimeter(): number {
    return this.calculatePerimeter();
  }

  public get segments(): ReadonlyArray<Line> {
    const segments = this._positions
      .flatMap((p) => this.getBorder(p))
      .map((s) => Polyline.makeFromLines([s]));

    return connectLines(segments).flatMap((p) => p.lines);
  }

  public containsPosition(position: Xy): boolean {
    return this._positionSet.has(position.hash());
  }

  private calculatePerimeter(): number {
    return this._positions
      .map((p) => this.calculatePerimeterForPosition(p))
      .reduce((sum, n) => sum + n);
  }

  private calculatePerimeterForPosition(position: Xy): number {
    return orthogonalDirections
      .map((offset) => position.add(offset))
      .map((p) => (this.containsPosition(p) ? 0 : 1))
      .reduce((sum: number, n) => sum + n, 0);
  }

  public touches(other: Region): boolean {
    return this._positions.some((pos) =>
      orthogonalDirections.some((o) => other.containsPosition(pos.add(o)))
    );
  }

  public merge(other: Region): Region {
    return new Region(this._plant, [...this._positions, ...other._positions]);
  }

  private getBorder(p: Xy): ReadonlyArray<Line> {
    const result: Array<Line> = [];

    if (!this.containsPosition(p.add(new Xy(1, 0)))) {
      result.push(new Line(p.add(new Xy(1, 0)), p.add(new Xy(1, 1))));
    }

    if (!this.containsPosition(p.add(new Xy(-1, 0)))) {
      result.push(new Line(p, p.add(new Xy(0, 1))));
    }

    if (!this.containsPosition(p.add(new Xy(0, -1)))) {
      result.push(new Line(p, p.add(new Xy(1, 0))));
    }

    if (!this.containsPosition(p.add(new Xy(0, 1)))) {
      result.push(new Line(p.add(new Xy(0, 1)), p.add(new Xy(1, 1))));
    }

    return result;
  }
}
