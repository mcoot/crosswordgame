import { BoundsCheckError } from '../validation/bounds-checking';
import { InvalidModelError } from '../validation/custom-errors';
import { Grid } from './Grid';

describe('model/Grid', () => {
  describe('Grid', () => {
    describe('construction', () => {
      it('fails if dimension is non-integral', () => {
        const data = [
          ['a', '', 'a'],
          ['a', 'a', 'a'],
          ['a', 'a', ''],
        ];
        expect(() => new Grid(2.5, data)).toThrowError(InvalidModelError);
      });

      it('fails if dimension is negative', () => {
        const data = [
          ['a', '', 'a'],
          ['a', 'a', 'a'],
          ['a', 'a', ''],
        ];
        expect(() => new Grid(-1, data)).toThrowError(InvalidModelError);
      });

      it('fails if dimension is zero', () => {
        const data = [
          ['a', '', 'a'],
          ['a', 'a', 'a'],
          ['a', 'a', ''],
        ];
        expect(() => new Grid(0, data)).toThrowError(InvalidModelError);
      });

      it('fails validation if data grid has uneven rows', () => {
        const data = [
          ['a', 'a', 'a'],
          ['a', 'a'],
          ['a', 'a', 'a'],
        ];
        expect(() => new Grid(3, data)).toThrowError(InvalidModelError);
      });

      it('fails validation if data grid is not square', () => {
        const data = [
          ['a', 'a', 'a'],
          ['a', 'a', 'a'],
          ['a', 'a', 'a'],
          ['a', 'a', 'a'],
        ];
        expect(() => new Grid(3, data)).toThrowError(InvalidModelError);
      });

      it('fails validation if a cell has multiple characters in it', () => {
        const data = [
          ['a', 'a', 'a'],
          ['a', 'blep', 'a'],
          ['a', 'a', 'a'],
        ];
        expect(() => new Grid(3, data)).toThrowError(InvalidModelError);
      });

      it('succeeds with empty and single character cells', () => {
        const data = [
          ['a', '', 'a'],
          ['a', 'a', 'a'],
          ['a', 'a', ''],
        ];
        expect(() => new Grid(3, data)).not.toThrow();
      });
    });

    describe('instance methods', () => {
      let rawData: string[][];
      let grid: Grid;
      beforeEach(() => {
        rawData = [
          ['a', 'b', 'c'],
          ['d', 'e', 'f'],
          ['g', 'h', ''],
        ];
        grid = new Grid(3, rawData);
      });

      it('dimension returns the correct dimension', () => {
        expect(grid.dimension).toBe(3);
      });

      describe('boundsCheck', () => {
        it('checks row bounds', () => {
          expect(() => grid.boundsCheck([-1, 1])).toThrowError(
            BoundsCheckError,
          );
          expect(() => grid.boundsCheck([3, 1])).toThrowError(BoundsCheckError);
        });

        it('checks column bounds', () => {
          expect(() => grid.boundsCheck([1, -1])).toThrowError(
            BoundsCheckError,
          );
          expect(() => grid.boundsCheck([1, 3])).toThrowError(BoundsCheckError);
        });

        it('allows in-bounds', () => {
          expect(() => grid.boundsCheck([0, 0])).not.toThrow();
          expect(() => grid.boundsCheck([1, 1])).not.toThrow();
          expect(() => grid.boundsCheck([2, 2])).not.toThrow();
        });
      });

      describe('get', () => {
        it('checks row bounds', () => {
          expect(() => grid.get([-1, 1])).toThrowError(BoundsCheckError);
          expect(() => grid.get([3, 1])).toThrowError(BoundsCheckError);
        });

        it('checks column bounds', () => {
          expect(() => grid.get([1, -1])).toThrowError(BoundsCheckError);
          expect(() => grid.get([1, 3])).toThrowError(BoundsCheckError);
        });

        it('returns the correct cell', () => {
          expect(grid.get([1, 1])).toBe('e');
        });
      });

      describe('place', () => {
        let grid: Grid;
        beforeEach(() => {
          grid = new Grid(3, [
            ['', '', ''],
            ['', 'a', ''],
            ['', '', ''],
          ]);
        });

        it('checks bounds', () => {
          expect(() => grid.place('b', [5, 5])).toThrowError(BoundsCheckError);
        });

        it('fails if multi-character string provided', () => {
          expect(() => grid.place('potato', [0, 0])).toThrowError(
            InvalidModelError,
          );
        });

        it('fails if empty string is provided', () => {
          expect(() => grid.place('', [0, 0])).toThrowError(InvalidModelError);
        });

        it('fails if position is not presently empty', () => {
          expect(() => grid.place('b', [1, 1])).toThrowError(InvalidModelError);
        });

        it('sets letter for cell', () => {
          expect(() => grid.place('b', [0, 0])).not.toThrow();
          expect(grid.get([0, 0])).toBe('b');
        });
      });

      describe('raw', () => {
        it('returns the raw grid', () => {
          expect(grid.raw()).toEqual(rawData);
        });

        it('is a deep copy', () => {
          const rawGrid = grid.raw();
          rawGrid[0][0] = 'lol';
          expect(grid.get([0, 0])).toBe('a');
        });
      });

      describe('iteration', () => {
        it('yields all cells in order by row and column', () => {
          const result: string[] = [];
          for (const [c, _] of grid) {
            result.push(c);
          }
          expect(result).toEqual(rawData.flat());
        });
      });

      describe('some', () => {
        it('returns true when predicate is true anywhere', () => {
          expect(grid.some((c) => c === '')).toBe(true);
        });

        it('returns false when predicate is false everywhere', () => {
          expect(grid.some((c) => c === 'q')).toBe(false);
        });
      });

      describe('all', () => {
        it('returns true when predicate is true everywhere', () => {
          expect(grid.all((c) => c.length < 2)).toBe(true);
        });

        it('returns false when predicate is false anywhere', () => {
          expect(grid.all((c) => c.length === 1)).toBe(false);
        });
      });
    });

    describe('static methods', () => {
      describe('empty', () => {
        it('fails if construction fails', () => {
          expect(() => Grid.empty(2.5)).toThrowError(InvalidModelError);
        });

        it('creates empty grid of expected dimension', () => {
          const result = Grid.empty(3);
          expect(result.dimension).toBe(3);

          expect(result.all((c) => c === '')).toBe(true);
        });
      });
    });
  });
});
