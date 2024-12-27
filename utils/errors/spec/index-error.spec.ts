import { expect } from "jsr:@std/expect/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import { EmptyRange } from "../../range/empty-range.ts";
import { Range } from "../../range/range.ts";
import { IndexError } from "../index-error.ts";

describe("IndexError", () => {
  describe("constructor", () => {
    it("Creates an error message for an empty range.", () => {
      const error = new IndexError(2, new EmptyRange());

      expect(error.message).toContain("empty");
    });

    it("Creates an error message for a range.", () => {
      const error = new IndexError(4, new Range(0, 3));

      expect(error.message).toContain("[0, 3]");
      expect(error.message).toContain("received: 4");
    });
  });
});
