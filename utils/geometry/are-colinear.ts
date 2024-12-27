import { Line } from "./line.ts";

export function areColinear(prev: Line, next: Line): boolean {
  return areParallel(prev, next) && areConnected(prev, next);
}

export function areParallel(prev: Line, next: Line): boolean {
  return prev.slope.angle.isParallel(next.slope.angle);
}

export function areConnected(prev: Line, next: Line): boolean {
  return prev.end.equals(next.start);
}
