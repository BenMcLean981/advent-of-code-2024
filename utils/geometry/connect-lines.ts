import { Polyline } from "./polyline.ts";

// TODO: Switch to connectSegments

export function connectLines(
  lines: ReadonlyArray<Polyline>
): ReadonlyArray<Polyline> {
  const result: Array<Polyline> = [lines[0]];

  lines.slice(1).forEach((l1) => {
    const matchIndex = result.findIndex((l2) => areConnectable(l1, l2));

    if (matchIndex === -1) {
      result.push(l1);
    } else {
      const l2 = result[matchIndex];
      result[matchIndex] = connect(l1, l2);
    }
  });

  if (result.length === lines.length) {
    return result.map((l) => l.compress());
  } else {
    return connectLines(result);
  }
}

function areConnectable(l1: Polyline, l2: Polyline): boolean {
  return (
    l1.start.equals(l2.start) ||
    l1.start.equals(l2.end) ||
    l1.end.equals(l2.start) ||
    l1.end.equals(l2.end)
  );
}

function connect(l1: Polyline, l2: Polyline): Polyline {
  if (l1.end.equals(l2.start)) {
    return Polyline.makeFromLines([...l1.lines, ...l2.lines]);
  } else if (l1.end.equals(l2.end)) {
    return Polyline.makeFromLines([...l1.lines, ...l2.reverse().lines]);
  } else if (l1.start.equals(l2.end)) {
    return Polyline.makeFromLines([...l2.lines, ...l1.lines]);
  } else if (l1.start.equals(l2.start)) {
    return Polyline.makeFromLines([...l2.reverse().lines, ...l1.lines]);
  } else {
    throw new Error("Not connectable.");
  }
}
