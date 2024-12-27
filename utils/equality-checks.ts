import { TOL } from "./tol.ts";

export function almostEqual(n1: number, n2: number, tol = TOL): boolean {
  return Math.abs(n1 - n2) <= tol;
}

export function isZero(n: number, tol = TOL): boolean {
  return almostEqual(n, 0, tol);
}

export function lessThanOrAlmostEqual(
  n1: number,
  n2: number,
  tol = TOL
): boolean {
  return n1 < n2 || almostEqual(n1, n2, tol);
}

export function lessThanAndNotEqual(
  n1: number,
  n2: number,
  tol = TOL
): boolean {
  return n1 < n2 && !almostEqual(n1, n2, tol);
}

export function greaterThanOrAlmostEqual(
  n1: number,
  n2: number,
  tol = TOL
): boolean {
  return n1 > n2 || almostEqual(n1, n2, tol);
}

export function greaterThanAndNotEqual(
  n1: number,
  n2: number,
  tol = TOL
): boolean {
  return n1 > n2 && !almostEqual(n1, n2, tol);
}
