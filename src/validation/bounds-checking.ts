import { CustomError } from './custom-errors';

export class BoundsCheckError extends CustomError {
  constructor(message: string, bounds: [number, number], value: number) {
    super(
      `${message}: bounds check error: ${value} not in bounds ${bounds[0]},${bounds[1]}`,
    );
  }
}

export function boundsCheckInclusive(
  bounds: [number, number],
  value: number,
  errMessage: string,
): void {
  if (value < bounds[0] || value > bounds[1]) {
    throw new BoundsCheckError(errMessage, bounds, value);
  }
}

export function boundsCheckExclusive(
  bounds: [number, number],
  value: number,
  errMessage: string,
): void {
  if (value <= bounds[0] || value >= bounds[1]) {
    throw new BoundsCheckError(errMessage, bounds, value);
  }
}

export function boundsCheckSemiInclusive(
  bounds: [number, number],
  value: number,
  errMessage: string,
): void {
  if (value < bounds[0] || value >= bounds[1]) {
    throw new BoundsCheckError(errMessage, bounds, value);
  }
}
