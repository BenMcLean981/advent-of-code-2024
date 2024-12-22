import { Grid } from "../../utils/grid.ts";
import { orthogonalDirections, Xy } from "../../utils/xy.ts";

export class Map {
  private readonly _grid: Grid<number>;

  public constructor(grid: Grid<number>) {
    this._grid = grid;
  }

  public getTrails(): ReadonlyArray<Trail> {
    return this.getStartPositions()
      .map((s) => new Trail([s]))
      .flatMap((t) => this.expandTrail(t));
  }

  private expandTrail(trail: Trail): ReadonlyArray<Trail> {
    if (this._grid.get(trail.end) === 9) {
      return [trail];
    }

    return this.getOptions(trail).flatMap((t) => this.expandTrail(t));
  }

  private getOptions(trail: Trail): ReadonlyArray<Trail> {
    const next = orthogonalDirections.map((t) => trail.end.add(t));
    const noLoops = next.filter((pos) => !trail.visited(pos));
    const valid = noLoops.filter((pos) => this.isValid(trail.end, pos));

    return valid.map((pos) => trail.add(pos));
  }

  private isValid(current: Xy, next: Xy): boolean {
    const currentHeight = this._grid.get(current);
    const nextHeight = this._grid.get(next);

    if (currentHeight === undefined) {
      throw new Error("Visited bad position.");
    } else if (nextHeight === undefined) {
      return false;
    } else {
      return nextHeight - currentHeight === 1;
    }
  }

  private getStartPositions(): ReadonlyArray<Xy> {
    return [...this._grid.positions].filter((p) => this._grid.get(p) === 0);
  }
}

export class Trail {
  private readonly _positions: ReadonlyArray<Xy>;

  public constructor(positions: ReadonlyArray<Xy>) {
    if (positions.length === 0) {
      throw new Error("Cannot have empty trail.");
    }

    this._positions = positions;
  }

  public get start(): Xy {
    return this._positions[0];
  }

  public get end(): Xy {
    return this._positions[this._positions.length - 1];
  }

  public add(position: Xy): Trail {
    return new Trail([...this._positions, position]);
  }

  public visited(position: Xy): boolean {
    return this._positions.every((pos) => pos.equals(position));
  }
}
