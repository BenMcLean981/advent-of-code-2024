import { expect } from "jsr:@std/expect/expect";
import { describe, it, beforeEach } from "jsr:@std/testing/bdd";
import { equalInOrderCircular } from "../../collections/index.ts";
import { compressLines } from "../compress-lines.ts";
import { Line } from "../line.ts";
import { Xy } from "../xy.ts";

describe("compressLines", () => {
  it("Does nothing for an empty array.", () => {
    expectSameLines([], compressLines([]));
  });

  describe("open", () => {
    let compressed: Array<Line>;

    beforeEach(() => {
      compressed = [
        new Line(new Xy(0, 0), new Xy(0, 10)),
        new Line(new Xy(0, 10), new Xy(10, 10)),
        new Line(new Xy(10, 10), new Xy(10, 0)),
      ];
    });

    it("Does nothing for already compressed lines.", () => {
      expectSameLines(compressed, compressLines(compressed));
    });

    it("Compresses colinear lines.", () => {
      const lines = [
        new Line(new Xy(0, 0), new Xy(0, 3)),
        new Line(new Xy(0, 3), new Xy(0, 7)),
        new Line(new Xy(0, 7), new Xy(0, 10)),
        new Line(new Xy(0, 10), new Xy(5, 10)),
        new Line(new Xy(5, 10), new Xy(10, 10)),
        new Line(new Xy(10, 10), new Xy(10, 0)),
      ];

      expectSameLines(compressed, compressLines(lines));
    });

    it("Compresses backwards.", () => {
      const lines = [
        new Line(new Xy(0, 0), new Xy(0, 3)),
        new Line(new Xy(0, 3), new Xy(0, 2)),
        new Line(new Xy(0, 2), new Xy(0, 10)),
        new Line(new Xy(0, 10), new Xy(5, 10)),
        new Line(new Xy(5, 10), new Xy(4, 10)),
        new Line(new Xy(4, 10), new Xy(10, 10)),
        new Line(new Xy(10, 10), new Xy(10, 0)),
      ];

      expectSameLines(compressed, compressLines(lines));
    });

    it("Compresses zero length.", () => {
      const lines = [
        new Line(new Xy(0, 0), new Xy(0, 3)),
        new Line(new Xy(0, 3), new Xy(0, 3)),
        new Line(new Xy(0, 3), new Xy(0, 2)),
        new Line(new Xy(0, 2), new Xy(0, 10)),
        new Line(new Xy(0, 10), new Xy(5, 10)),
        new Line(new Xy(5, 10), new Xy(4, 10)),
        new Line(new Xy(4, 10), new Xy(10, 10)),
        new Line(new Xy(10, 10), new Xy(10, 0)),
      ];

      expectSameLines(compressed, compressLines(lines));
    });

    it("Removes zero length segments.", () => {
      const lines = [
        new Line(new Xy(0, 3), new Xy(0, 0)),
        new Line(new Xy(0, 0), new Xy(5, 0)),
        new Line(new Xy(5, 0), new Xy(0, 0)),
      ];

      const expected = [lines[0]];

      expectSameLines(expected, compressLines(lines));
    });
  });

  describe("circular", () => {
    let compressed: Array<Line>;

    beforeEach(() => {
      compressed = [
        new Line(new Xy(0, 0), new Xy(0, 10)),
        new Line(new Xy(0, 10), new Xy(10, 10)),
        new Line(new Xy(10, 10), new Xy(10, 0)),
        new Line(new Xy(10, 0), new Xy(0, 0)),
      ];
    });

    it("Does nothing for already compressed lines.", () => {
      expectSameLines(compressed, compressLines(compressed));
    });

    it("Compresses colinear lines.", () => {
      const lines = [
        new Line(new Xy(0, 0), new Xy(0, 3)),
        new Line(new Xy(0, 3), new Xy(0, 7)),
        new Line(new Xy(0, 7), new Xy(0, 10)),
        new Line(new Xy(0, 10), new Xy(5, 10)),
        new Line(new Xy(5, 10), new Xy(10, 10)),
        new Line(new Xy(10, 10), new Xy(10, 0)),
        new Line(new Xy(10, 0), new Xy(0, 0)),
      ];

      expectSameLines(compressed, compressLines(lines));
    });

    it("Compresses lines between end/start.", () => {
      const lines = [
        new Line(new Xy(3, 0), new Xy(0, 0)),
        new Line(new Xy(0, 0), new Xy(0, 3)),
        new Line(new Xy(0, 3), new Xy(0, 7)),
        new Line(new Xy(0, 7), new Xy(0, 10)),
        new Line(new Xy(0, 10), new Xy(5, 10)),
        new Line(new Xy(5, 10), new Xy(10, 10)),
        new Line(new Xy(10, 10), new Xy(10, 0)),
        new Line(new Xy(10, 0), new Xy(7, 0)),
        new Line(new Xy(7, 0), new Xy(3, 0)),
      ];

      expectSameLines(compressed, compressLines(lines));
    });

    it("Compresses zero length.", () => {
      const lines = [
        new Line(new Xy(3, 0), new Xy(0, 0)),
        new Line(new Xy(0, 0), new Xy(0, 3)),
        new Line(new Xy(0, 3), new Xy(0, 7)),
        new Line(new Xy(0, 7), new Xy(0, 10)),
        new Line(new Xy(0, 10), new Xy(5, 10)),
        new Line(new Xy(5, 10), new Xy(10, 10)),
        new Line(new Xy(10, 10), new Xy(10, 0)),
        new Line(new Xy(10, 0), new Xy(7, 0)),
        new Line(new Xy(7, 0), new Xy(3, 0)),
        new Line(new Xy(3, 0), new Xy(3, 0)),
      ];

      expectSameLines(compressed, compressLines(lines));
    });
  });
});

function expectSameLines(expected: Array<Line>, actual: Array<Line>): void {
  const equalCircularly = equalInOrderCircular(expected, actual, (l1, l2) =>
    l1.equals(l2)
  );

  expect(equalCircularly).toBe(true);
}
