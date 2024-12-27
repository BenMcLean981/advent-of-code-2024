import { Xy } from "./geometry/xy.ts";

export class Grid<T> {
  private readonly _rows: ReadonlyArray<ReadonlyArray<T>>;

  public constructor(rows: ReadonlyArray<ReadonlyArray<T>>) {
    this._rows = rows;
  }

  public get rows(): ReadonlyArray<ReadonlyArray<T>> {
    return this._rows;
  }

  public get positions(): Iterable<Xy> {
    return this._rows.flatMap((row, rowIdx) =>
      row.map((_, colIdx) => new Xy(rowIdx, colIdx))
    );
  }

  public get(position: Xy): T | undefined {
    if (!this.contains(position)) {
      return undefined;
    }

    return this.rows[position.y][position.x];
  }

  public contains(position: Xy): boolean {
    return (
      position.y >= 0 &&
      position.y <= this.rows.length - 1 &&
      position.x >= 0 &&
      position.x <= this.rows[0].length - 1
    );
  }

  public set(position: Xy, value: T): Grid<T> {
    if (this.get(position) === undefined) {
      throw new Error("Out of range.");
    }

    const newRows = this._rows.map((row, y) =>
      row.map((c, x) => {
        const pos = new Xy(x, y);

        if (pos.equals(position)) {
          return value;
        } else {
          return c;
        }
      })
    );

    return new Grid(newRows);
  }

  public clone(): Grid<T> {
    return new Grid(this.rows.map((r) => [...r]));
  }
}
