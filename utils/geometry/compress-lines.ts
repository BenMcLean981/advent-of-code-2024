import { isEmpty, last, first } from "../collections/array.ts";
import { isZero } from "../equality-checks.ts";
import { areConnected, areColinear } from "./are-colinear.ts";
import { Line } from "./line.ts";

export function compressLines(lines: Array<Line>): Array<Line> {
  if (isEmpty(lines)) {
    return [];
  }

  if (areConnected(last(lines), first(lines))) {
    return compressCircular(lines).filter((l) => !isLengthZero(l));
  } else {
    return compressOpen(lines).filter((l) => !isLengthZero(l));
  }
}

function compressCircular(lines: Line[]): Line[] {
  const compressed = compressOpen(lines);

  tryCompressingFirstAndLast(compressed);

  return compressed;
}

function compressOpen(lines: Line[]): Line[] {
  const compressed: Array<Line> = [first(lines)];
  const toCompress = lines.slice(1);

  while (!isEmpty(toCompress)) {
    const next = toCompress.shift() as Line;

    addToCompressed(compressed, next);
  }

  return compressed;
}

function addToCompressed(compressed: Array<Line>, next: Line): void {
  const prev = last(compressed);

  if (shouldCompress(prev, next)) {
    compressed.pop();
    compressed.push(new Line(prev.start, next.end));
  } else {
    compressed.push(next);
  }
}

function tryCompressingFirstAndLast(compressed: Line[]): void {
  const lastLine = last(compressed);
  const firstLine = first(compressed);

  if (shouldCompress(lastLine, firstLine)) {
    compressed.shift();
    compressed.pop();
    compressed.push(new Line(lastLine.start, firstLine.end));
  }
}

function shouldCompress(prev: Line, next: Line) {
  return areColinear(prev, next) || isLengthZero(prev) || isLengthZero(next);
}

function isLengthZero(line: Line): boolean {
  return isZero(line.length);
}
