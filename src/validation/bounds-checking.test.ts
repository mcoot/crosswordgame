import {
  BoundsCheckError,
  boundsCheckExclusive,
  boundsCheckInclusive,
  boundsCheckSemiInclusive,
} from './bounds-checking';

describe('bounds checking', () => {
  describe('boundsCheckInclusive', () => {
    it('allows value between bounds', () => {
      expect(() => boundsCheckInclusive([1, 5], 3, 'failed')).not.toThrow();
    });

    it('rejects value below bounds', () => {
      expect(() => boundsCheckInclusive([1, 5], 0, 'failed')).toThrowError(
        BoundsCheckError,
      );
    });

    it('rejects value above bounds', () => {
      expect(() => boundsCheckInclusive([1, 5], 6, 'failed')).toThrowError(
        BoundsCheckError,
      );
    });

    it('allows value on lower bound', () => {
      expect(() => boundsCheckInclusive([1, 5], 1, 'failed')).not.toThrow();
    });

    it('allows value on upper bound', () => {
      expect(() => boundsCheckInclusive([1, 5], 5, 'failed')).not.toThrow();
    });
  });

  describe('boundsCheckExclusive', () => {
    it('allows value between bounds', () => {
      expect(() => boundsCheckExclusive([1, 5], 3, 'failed')).not.toThrow();
    });

    it('rejects value below bounds', () => {
      expect(() => boundsCheckExclusive([1, 5], 0, 'failed')).toThrowError(
        BoundsCheckError,
      );
    });

    it('rejects value above bounds', () => {
      expect(() => boundsCheckExclusive([1, 5], 6, 'failed')).toThrowError(
        BoundsCheckError,
      );
    });

    it('rejects value on lower bound', () => {
      expect(() => boundsCheckExclusive([1, 5], 1, 'failed')).toThrowError(
        BoundsCheckError,
      );
    });

    it('rejects value on upper bound', () => {
      expect(() => boundsCheckExclusive([1, 5], 5, 'failed')).toThrowError(
        BoundsCheckError,
      );
    });
  });

  describe('boundsCheckSemiInclusive', () => {
    it('allows value between bounds', () => {
      expect(() => boundsCheckSemiInclusive([1, 5], 3, 'failed')).not.toThrow();
    });

    it('rejects value below bounds', () => {
      expect(() => boundsCheckSemiInclusive([1, 5], 0, 'failed')).toThrowError(
        BoundsCheckError,
      );
    });

    it('rejects value above bounds', () => {
      expect(() => boundsCheckSemiInclusive([1, 5], 6, 'failed')).toThrowError(
        BoundsCheckError,
      );
    });

    it('allows value on lower bound', () => {
      expect(() => boundsCheckSemiInclusive([1, 5], 1, 'failed')).not.toThrow();
    });

    it('rejects value on upper bound', () => {
      expect(() => boundsCheckSemiInclusive([1, 5], 5, 'failed')).toThrowError(
        BoundsCheckError,
      );
    });
  });
});
