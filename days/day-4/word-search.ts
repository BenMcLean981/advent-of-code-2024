import { cardinalDirections, diagonalDirections, Xy } from "./position.ts";

export class WordSearch {
  private readonly _rows: ReadonlyArray<ReadonlyArray<string>>;

  public constructor(rows: ReadonlyArray<ReadonlyArray<string>>) {
    this._rows = rows;
  }

  public get(position: Xy): string | undefined {
    const row = this._rows[position.y];

    if (row === undefined) {
      return undefined;
    } else {
      return row[position.x];
    }
  }

  public countXmas(): number {
    return [...this.positions].reduce(
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
      (letter, idx) => this.get(position.add(axis.scale(idx))) === letter
    );
  }

  public countXmasShape(): number {
    return [...this.positions].reduce(
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

  private get positions(): Iterable<Xy> {
    return this._rows.flatMap((row, rowIdx) =>
      row.map((_, colIdx) => new Xy(rowIdx, colIdx))
    );
  }
}
