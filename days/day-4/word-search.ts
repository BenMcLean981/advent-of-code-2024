import { Grid } from "../../utils/grid.ts";
import {
  cardinalDirections,
  diagonalDirections,
  Xy,
} from "../../utils/geometry/xy.ts";

export class WordSearch {
  private readonly _grid: Grid<string>;

  public constructor(grid: Grid<string>) {
    this._grid = grid;
  }

  public countXmas(): number {
    return [...this._grid.positions].reduce(
      (sum, pos) => sum + this.countXmasAtPosition(pos),
      0
    );
  }

  private countXmasAtPosition(position: Xy): number {
    return cardinalDirections.filter((axis) =>
      this.isAlongAxis("XMAS", position, axis)
    ).length;
  }

  private isAlongAxis(word: string, position: Xy, axis: Xy): boolean {
    return [...word].every(
      (letter, idx) => this._grid.get(position.add(axis.scale(idx))) === letter
    );
  }

  public countXmasShape(): number {
    return [...this._grid.positions].reduce(
      (sum, pos) => (this.isMas(pos) ? sum + 1 : sum),
      0
    );
  }

  private isMas(position: Xy): boolean {
    const word = "MAS";

    return diagonalDirections.some((d1) =>
      diagonalDirections.some(
        (d2) =>
          !d1.equals(d2) &&
          this.isAlongAxis(word, position.add(d1), d1.scale(-1)) &&
          this.isAlongAxis(word, position.add(d2), d2.scale(-1))
      )
    );
  }
}
