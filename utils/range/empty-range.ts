import { Range } from "./range.ts";

export class EmptyRange extends Range {
  public override get lower(): number {
    throw new EmptyRangeError();
  }

  public override get upper(): number {
    throw new EmptyRangeError();
  }

  public override get range(): number {
    throw new EmptyRangeError();
  }

  constructor() {
    super(-1, -1);
  }

  public override getPercentage(): number {
    throw new EmptyRangeError();
  }

  public override contains(): boolean {
    return false;
  }
}

export class EmptyRangeError extends Error {
  constructor() {
    super("Range is empty.");
  }
}
