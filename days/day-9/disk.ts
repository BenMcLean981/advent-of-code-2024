import { notUndefined } from "../../utils.ts";

export class Disk {
  private readonly _blocks: ReadonlyArray<Block>;

  public constructor(segments: ReadonlyArray<Block>) {
    this._blocks = segments;
  }

  public get shouldFragment(): boolean {
    return this._blocks.some((b) => b.id === undefined);
  }

  private get firstFreeBlock(): FreeBlock {
    const free = this._blocks.find(isFreeBlock);

    if (free === undefined) {
      throw new Error("No free space.");
    }

    return free;
  }

  private get lastFullBlock(): FullBlock {
    const full = this._blocks.toReversed().find(isFullBlock);

    if (full === undefined) {
      throw new Error("No full blocks.");
    }

    return full;
  }

  public get checksum(): number {
    const checksums = this._blocks.filter(isFullBlock).map(getChecksum);

    return checksums.reduce((sum, n) => sum + n);
  }

  public fragment(): Disk {
    let result = this as Disk;

    while (result.shouldFragment) {
      result = result.stepFrag();
    }

    return result;
  }

  public defragment(): Disk {
    let result = this as Disk;

    let id = this._blocks
      .map((b) => b.id)
      .filter(notUndefined)
      .reduce((max, id) => Math.max(max, id));

    while (id >= 0) {
      const block = result.getBlock(id);
      const slot = result.findSpace(block.size, block.position);

      if (slot !== undefined) {
        result = result.move(block, slot);
      }

      id -= 1;
    }

    return result;
  }

  private getBlock(id: number): FullBlock {
    const block = this._blocks.filter(isFullBlock).find((b) => b.id === id);

    if (block === undefined) {
      throw new Error(`No block with id "${id}".`);
    }

    return block;
  }

  private findSpace(size: number, position: number): FreeBlock | undefined {
    return this._blocks
      .filter(isFreeBlock)
      .find((b) => b.size >= size && b.position < position);
  }

  private toString(): string {
    return this._blocks
      .map((b) => (b.id?.toString() ?? ".").repeat(b.size))
      .join("");
  }

  private stepFrag(): Disk {
    return this.move(this.lastFullBlock, this.firstFreeBlock).trim();
  }

  private trim(): Disk {
    return this.trimFront().trimRear();
  }

  private trimFront(): Disk {
    const toSkip = this._blocks.find(isFullBlock)?.index;

    if (toSkip === undefined) {
      return this;
    }

    return new Disk(
      this._blocks.slice(toSkip).map((block, index) => ({ ...block, index }))
    );
  }

  private trimRear(): Disk {
    return new Disk(this._blocks.slice(0, this.lastFullBlock.index + 1));
  }

  private move(full: FullBlock, free: FreeBlock): Disk {
    if (full.size === free.size) {
      return this.moveSameSize(free, full);
    } else if (full.size > free.size) {
      return this.moveLarger(free, full);
    } else {
      return this.moveSmaller(free, full);
    }
  }

  private moveSameSize(free: FreeBlock, full: FullBlock) {
    const newFull: FullBlock = {
      id: full.id,
      size: full.size,
      position: free.position,
      index: free.index,
    };

    const moved = setAtIndex(this._blocks, free.index, newFull);
    const oldRemoved = removeAtIndex(moved, full.index);

    return new Disk(oldRemoved);
  }

  private moveLarger(free: FreeBlock, full: FullBlock) {
    const fill: FullBlock = {
      id: full.id,
      index: free.index,
      size: free.size,
      position: free.position,
    };

    const replacement: FullBlock = {
      id: full.id,
      index: free.index,
      size: full.size - free.size,
      position: full.position,
    };

    const fillMoved = setAtIndex(this._blocks, free.index, fill);
    const fullReplaced = setAtIndex(fillMoved, full.index, replacement);

    return new Disk(fullReplaced);
  }

  private moveSmaller(free: FreeBlock, full: FullBlock): Disk {
    const newFull: FullBlock = {
      id: full.id,
      index: free.index,
      size: full.size,
      position: free.position,
    };

    const newFree: FreeBlock = {
      index: free.index + 1,
      size: free.size - full.size,
      position: free.position + full.size,
    };

    const fullMoved = setAtIndex(this._blocks, newFull.index, newFull);
    const fullRemoved = removeAtIndex(fullMoved, full.index);

    const newFreePlaced = [
      ...fullRemoved.slice(0, newFree.index),
      newFree,
      ...fullRemoved
        .slice(newFree.index)
        .map((b) => ({ ...b, index: b.index + 1 })),
    ];

    return new Disk(newFreePlaced);
  }
}

export type Block = FreeBlock | FullBlock;

export type FreeBlock = {
  position: number;

  index: number;

  id?: number;

  size: number;
};

export type FullBlock = {
  position: number;

  index: number;

  id: number;

  size: number;
};

function isFullBlock(block: Block): block is FullBlock {
  return block.id !== undefined;
}

function isFreeBlock(block: Block): block is FreeBlock {
  return block.id === undefined;
}

function getChecksum(block: FullBlock): number {
  let result = 0;

  for (let i = 0; i < block.size; i++) {
    result += (i + block.position) * block.id;
  }

  return result;
}

function setAtIndex<T>(
  arr: ReadonlyArray<T>,
  index: number,
  item: T
): ReadonlyArray<T> {
  return [...arr.slice(0, index), item, ...arr.slice(index + 1)];
}

function removeAtIndex<T>(
  arr: ReadonlyArray<T>,
  index: number
): ReadonlyArray<T> {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
