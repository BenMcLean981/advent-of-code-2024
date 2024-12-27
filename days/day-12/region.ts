import { orthogonalDirections, Xy } from "../../utils/xy.ts";

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

  public get price(): number {
    return this.area * this.perimeter;
  }

  public get area(): number {
    return this._positions.length;
  }

  public get perimeter(): number {
    return this.calculatePerimeter();
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
}
