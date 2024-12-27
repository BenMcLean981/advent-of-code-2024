import { Grid } from "../../utils/grid.ts";
import { makeAllPairs, Pair } from "../../utils/pair.ts";
import { Xy } from "../../utils/geometry/xy.ts";

export type CellContent =
  | { type: "Empty" }
  | { type: "Antenna"; frequency: string };

export class Map {
  private readonly _grid: Grid<CellContent>;

  private readonly _antennas: Record<string, Array<Xy>> = {};

  constructor(grid: Grid<CellContent>) {
    this._grid = grid;

    this._antennas = {};

    [...grid.positions].forEach((position) => {
      const content = grid.get(position);

      if (content?.type === "Antenna") {
        if (content.frequency in this._antennas) {
          this._antennas[content.frequency].push(position);
        } else {
          this._antennas[content.frequency] = [position];
        }
      }
    });
  }

  public get frequencies(): Set<string> {
    const frequencies = [...this._grid.positions]
      .map((pos) => this._grid.get(pos))
      .filter((c) => c !== undefined)
      .filter((c) => c.type === "Antenna")
      .map((c) => c.frequency);

    return new Set(frequencies);
  }

  public getAllDoubleDistanceAntinodes(): ReadonlyArray<Xy> {
    const hashes = [...this.frequencies]
      .flatMap((f) => this.getDoubleDistanceAntinodes(f))
      .map((p) => p.hash());

    const distinct = new Set(hashes);

    return [...distinct].map(Xy.parse);
  }

  public getAllAntinodes(): ReadonlyArray<Xy> {
    const hashes = [...this.frequencies]
      .flatMap((f) => this.getAntinodes(f))
      .map((p) => p.hash());

    const distinct = new Set(hashes);

    return [...distinct].map(Xy.parse);
  }

  private getDoubleDistanceAntinodes(frequency: string): ReadonlyArray<Xy> {
    const antennaPositions = this._antennas[frequency];

    const antinodes = makeAllPairs(antennaPositions)
      .filter(([p1, p2]) => !p1.equals(p2))
      .flatMap((pair) => this.getDoubleDistanceAntinodesForPair(pair));

    return [...toDistinct(antinodes)];
  }

  private getAntinodes(frequency: string): ReadonlyArray<Xy> {
    const antennaPositions = this._antennas[frequency];

    const antinodes = makeAllPairs(antennaPositions)
      .filter(([p1, p2]) => !p1.equals(p2))
      .flatMap((pair) => this.getAntinodesForPair(pair));

    return [...toDistinct(antinodes)];
  }

  private getDoubleDistanceAntinodesForPair(pair: Pair<Xy>): ReadonlyArray<Xy> {
    const offset = pair[1].subtract(pair[0]);

    return [pair[1].add(offset), pair[0].subtract(offset)].filter((p) =>
      this._grid.contains(p)
    );
  }

  private getAntinodesForPair(pair: Pair<Xy>): ReadonlyArray<Xy> {
    const offset = pair[1].subtract(pair[0]);

    return [
      pair[0],
      pair[1],
      ...this.getAllInline(pair[1], offset),
      ...this.getAllInline(pair[0], offset.scale(-1)),
    ];
  }

  private getAllInline(base: Xy, offset: Xy): ReadonlyArray<Xy> {
    let d = 1;

    const result: Array<Xy> = [];

    while (true) {
      const p = base.add(offset.scale(d));

      if (!this._grid.contains(p)) {
        break;
      }

      result.push(p);

      d++;
    }

    return result;
  }
}

function toDistinct(positions: Iterable<Xy>): Iterable<Xy> {
  const hashes = [...positions].map((p) => p.hash());

  const distinct = new Set(hashes);

  return [...distinct].map(Xy.parse);
}
