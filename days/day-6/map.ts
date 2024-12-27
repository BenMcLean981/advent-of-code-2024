import { Grid } from "../../utils/grid.ts";
import { Xy } from "../../utils/geometry/xy.ts";

export type Guard = {
  position: Xy;
  direction: Xy;
};

export type CellContent = "Empty" | "Obstruction";

export class Map {
  private readonly _grid: Grid<CellContent>;

  private _guard: Guard;

  public constructor(grid: Grid<CellContent>, guard: Guard) {
    this._grid = grid;
    this._guard = guard;
  }

  public get guard(): Guard {
    return this._guard;
  }

  public get isGuardOffMap(): boolean {
    return this._grid.get(this._guard.position) === undefined;
  }

  public step(): void {
    const testPosition = this._guard.position.add(this._guard.direction);

    if (this._grid.get(testPosition) !== "Obstruction") {
      this._guard = { ...this._guard, position: testPosition };
    } else {
      this._guard = {
        ...this._guard,
        direction: rotate(this._guard.direction),
      };
    }
  }

  public addObstruction(position: Xy): Map {
    if (position.equals(this.guard.position)) {
      throw new Error("Cannot place obstruction where guard is.");
    }

    return new Map(this._grid.set(position, "Obstruction"), this.guard);
  }

  public clone(): Map {
    return new Map(this._grid.clone(), {
      position: this.guard.position.clone(),
      direction: this.guard.direction.clone(),
    });
  }
}

function rotate(xy: Xy): Xy {
  if (xy.equals(new Xy(1, 0))) {
    return new Xy(0, 1);
  } else if (xy.equals(new Xy(0, 1))) {
    return new Xy(-1, 0);
  } else if (xy.equals(new Xy(-1, 0))) {
    return new Xy(0, -1);
  } else if (xy.equals(new Xy(0, -1))) {
    return new Xy(1, 0);
  } else {
    throw new Error("Cannot rotate vector.");
  }
}
