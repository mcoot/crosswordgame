import { boundsCheckSemiInclusive } from '../validation/bounds-checking';
import { InvalidModelError } from '../validation/custom-errors';

type GridLocation = [number, number];

export class Grid implements Iterable<[string, GridLocation]> {
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

  static empty(dimension: number): Grid {
    if (!Number.isInteger(dimension) || dimension <= 0) {
      throw new InvalidModelError(`grid dimension ${dimension} is not valid`);
    }

    const data = Array(dimension).fill(Array(dimension).fill(''));
    return new Grid(dimension, data);
  }

  get dimension(): number {
    return this.#data.length;
  }

  get isFull(): boolean {
    return this.all((c) => c !== '');
  }

  boundsCheck(pos: [number, number]) {
    const [row, col] = pos;
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
  }

  get(pos: [number, number]): string {
    const [row, col] = pos;
    this.boundsCheck(pos);
    return this.#data[row][col];
  }

  place(letter: string, pos: [number, number]) {
    this.boundsCheck(pos);
    const [row, col] = pos;
    if (letter.length !== 1) {
      throw new InvalidModelError('cannot place non-single-character string');
    }
    if (this.get(pos) !== '') {
      throw new InvalidModelError('cannot place over existing placed letter');
    }

    this.#data[row][col] = letter;
  }

  raw(): string[][] {
    return [...this.#data.map((r) => [...r])];
  }

  *[Symbol.iterator](): Iterator<[string, GridLocation]> {
    for (const [rowNum, row] of this.#data.entries()) {
      for (const [colNum, cell] of row.entries()) {
        yield [cell, [rowNum, colNum]];
      }
    }
  }

  some(f: (c: string, pos: GridLocation) => boolean): boolean {
    for (const [cell, pos] of this) {
      if (f(cell, pos)) {
        return true;
      }
    }
    return false;
  }

  all(f: (c: string, pos: GridLocation) => boolean): boolean {
    for (const [cell, pos] of this) {
      if (!f(cell, pos)) {
        return false;
      }
    }
    return true;
  }
}
