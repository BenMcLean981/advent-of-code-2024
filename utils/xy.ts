export class Xy {
  private readonly _x: number;

  private readonly _y: number;

  public constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public static parse(hash: string): Xy {
    const xy = JSON.parse(hash);

    return new Xy(xy.x, xy.y);
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public add(xy: Xy): Xy {
    return new Xy(this.x + xy.x, this.y + xy.y);
  }

  public scale(n: number): Xy {
    return new Xy(this.x * n, this.y * n);
  }

  public clone(): Xy {
    return new Xy(this.x, this.y);
  }

  public equals(other: Xy): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public hash(): string {
    return JSON.stringify({ x: this.x, y: this.y });
  }
}

export const orthogonalDirections = [
  new Xy(1, 0),
  new Xy(0, 1),
  new Xy(-1, 0),
  new Xy(0, -1),
];

export const diagonalDirections = [
  new Xy(1, 1),
  new Xy(-1, 1),
  new Xy(-1, -1),
  new Xy(1, -1),
];

export const cardinalDirections = [
  ...orthogonalDirections,
  ...diagonalDirections,
];
