import { boundsCheckSemiInclusive } from '../validation/bounds-checking';
import { InvalidModelError } from '../validation/custom-errors';

export class Grid implements Iterable<[string, [number, number]]> {
  #data: string[][];

  constructor(dimension: number, data: string[][]) {
    if (!Number.isInteger(dimension) || dimension <= 0) {
      throw new InvalidModelError(`grid dimension ${dimension} is not valid`);
    }
    if (
      data.length !== dimension ||
      data.some((row) => row.length !== dimension)
    ) {
      throw new InvalidModelError('grid data did not match dimension');
    }
    if (data.some((row) => row.some((cell) => cell.length > 1))) {
      throw new InvalidModelError(
        'grid data contained non-single-character items',
      );
    }
    // Store a copy of the data
    this.#data = [...data.map((r) => [...r])];
  }

  get dimension(): number {
    return this.#data.length;
  }

  get(row: number, col: number): string {
    boundsCheckSemiInclusive(
      [0, this.#data.length],
      row,
      `invalid grid row coordinate ${row}`,
    );
    boundsCheckSemiInclusive(
      [0, this.#data[row].length],
      col,
      `invalid grid column coordinate ${col}`,
    );
    return this.#data[row][col];
  }

  raw(): string[][] {
    return [...this.#data.map((r) => [...r])];
  }

  *[Symbol.iterator](): Iterator<[string, [number, number]]> {
    for (const [rowNum, row] of this.#data.entries()) {
      for (const [colNum, cell] of row.entries()) {
        yield [cell, [rowNum, colNum]];
      }
    }
  }

  some(f: (c: string, pos: [number, number]) => boolean): boolean {
    for (const [cell, pos] of this) {
      if (f(cell, pos)) {
        return true;
      }
    }
    return false;
  }

  all(f: (c: string, pos: [number, number]) => boolean): boolean {
    for (const [cell, pos] of this) {
      if (!f(cell, pos)) {
        return false;
      }
    }
    return true;
  }
}

export class MutableGrid extends Grid {
  static empty(dimension: number): MutableGrid {
    if (!Number.isInteger(dimension) || dimension <= 0) {
      throw new InvalidModelError(`grid dimension ${dimension} is not valid`);
    }

    const data = Array(dimension).fill(Array(dimension).fill(''));
    return new MutableGrid(dimension, data);
  }
}
