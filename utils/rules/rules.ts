import { Range } from "../range/range.ts";

export interface Rules {
  readonly range: Range;

  shouldInclude(n: number, tol?: number): boolean;
}
