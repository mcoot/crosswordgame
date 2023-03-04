import { boundsCheckSemiInclusive } from '../validation/bounds-checking';
import { InvalidModelError } from '../validation/custom-errors';

export class Grid {
  #data: string[][];

  constructor(dimension: number, data: string[][]) {
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
    this.#data = data;
  }

  get(row: number, col: number) {
    boundsCheckSemiInclusive(
      [0, this.#data.length],
      row,
      `invalid grid row coordinate ${row}`,
    );
    boundsCheckSemiInclusive(
      [0, this.#data[row].length],
      row,
      `invalid grid column coordinate ${col}`,
    );
    return this.#data[row][col];
  }

  raw() {
    return [...this.#data.map((r) => [...r])];
  }

  static empty(dimension: number): Grid {
    const data = Array<undefined>(dimension).map((_) =>
      Array<undefined>(dimension).map((_) => ''),
    );
    return new Grid(dimension, data);
  }
}
