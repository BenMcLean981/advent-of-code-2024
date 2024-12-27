import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { EmptyRange } from "../empty-range.ts";
import { Range } from "../range.ts";
import { makeArrayIndices, makeEnlargedArrayIndices } from "../utils.ts";

describe("makeArrayIndices", () => {
  it("Returns EmptyRange for an empty array.", () => {
    const actual = makeArrayIndices([]);

    expect(actual).toBeInstanceOf(EmptyRange);
  });

  it("Returns [0, 0] for an array of length 1.", () => {
    const actual = makeArrayIndices([1]);
    const expected = new Range(0, 0);

    expectEquals(expected, actual);
  });

  it("Returns [0, 1] for an array of length 2.", () => {
    const actual = makeArrayIndices([1, 2]);
    const expected = new Range(0, 1);

    expectEquals(expected, actual);
  });

  it("Returns [0, length - 1] for an array of length > 2.", () => {
    const actual = makeArrayIndices([1, 2, 3, 4, 5]);
    const expected = new Range(0, 4);

    expectEquals(expected, actual);
  });
});

describe("makeEnlargedArrayIndices", () => {
  it("Returns [0, 0] for an empty array.", () => {
    const actual = makeEnlargedArrayIndices([]);
    const expected = new Range(0, 0);

    expectEquals(expected, actual);
  });

  it("Returns [0, 1] for an array of length 1.", () => {
    const actual = makeEnlargedArrayIndices([1]);
    const expected = new Range(0, 1);

    expectEquals(expected, actual);
  });

  it("Returns [0, 2] for an array of length 2.", () => {
    const actual = makeEnlargedArrayIndices([1, 2]);
    const expected = new Range(0, 2);

    expectEquals(expected, actual);
  });

  it("Returns [0, length] for an array of length > 2.", () => {
    const actual = makeEnlargedArrayIndices([1, 2, 3, 4, 5]);
    const expected = new Range(0, 5);

    expectEquals(expected, actual);
  });
});

function expectEquals(expected: Range, actual: Range) {
  expect(expected.lower).toEqual(actual.lower);
  expect(expected.upper).toEqual(actual.upper);
}
