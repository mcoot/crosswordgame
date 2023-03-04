export class CustomError extends Error {
  cause: Error | undefined;

  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
  }
}

export class InvalidModelError extends CustomError {}

export class UnknownPlayerError extends CustomError {
  constructor(player: string, cause?: Error) {
    super(`unknown player ${player}`, cause);
  }
}
