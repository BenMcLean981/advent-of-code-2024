import { isZero } from "../equality-checks.ts";
import { TOL } from "../tol.ts";
import { Angle } from "./angle.ts";

export class Xy {
  public readonly x: number;

  public readonly y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public get magnitude(): number {
    const dx = this.x * this.x;
    const dy = this.y * this.y;

    return Math.sqrt(dx + dy);
  }

  public static makeFromAngle(angle: Angle, length = 1): Xy {
    return new Xy(
      Math.cos(angle.radians) * length,
      Math.sin(angle.radians) * length
    );
  }

  public static makeDelta(from: Xy, to: Xy): Xy {
    return new Xy(to.x - from.x, to.y - from.y);
  }

  public get angle(): Angle {
    return Angle.makeRadians(Math.atan2(this.y, this.x)).normalizePositive();
  }

  public getDistance(other: Xy): number {
    const dx = other.x - this.x;
    const dy = other.y - this.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  public getManhattanDistance(other: Xy): number {
    const dx = Math.abs(this.x - other.x);
    const dy = Math.abs(this.y - other.y);

    return dx + dy;
  }

  public scale(n: number): Xy {
    return new Xy(this.x * n, this.y * n);
  }

  public add(other: Xy): Xy {
    return new Xy(this.x + other.x, this.y + other.y);
  }

  public subtract(other: Xy): Xy {
    return new Xy(this.x - other.x, this.y - other.y);
  }

  public dot(other: Xy): number {
    return this.x * other.x + this.y * other.y;
  }

  public toString(): string {
    return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }

  public equals(other: unknown, tol = TOL) {
    if (other instanceof Xy) {
      const distance = this.getDistance(other);

      return isZero(distance, tol);
    } else {
      return false;
    }
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
