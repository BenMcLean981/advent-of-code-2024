import { expect } from "jsr:@std/expect/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import { contains } from "../contains.ts";

describe("contains", () => {
  it("Returns false for an empty array.", () => {
    expect(contains([], "foo")).toBe(false);
  });

  it("Returns false for item not in array.", () => {
    expect(contains(["a", "b", "c"], "foo")).toBe(false);
  });

  it("Returns true for item in array.", () => {
    expect(contains(["foo", "b", "c"], "foo")).toBe(true);
    expect(contains(["a", "foo", "c"], "foo")).toBe(true);
    expect(contains(["a", "b", "foo"], "foo")).toBe(true);

    expect(contains(["foo"], "foo")).toBe(true);
  });
});
