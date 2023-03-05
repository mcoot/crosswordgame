export class CustomError extends Error {
  cause: Error | undefined;

  constructor(message: string, cause?: Error) {
    super(message);
    this.message = `${this.constructor.name}: ${this.message}`;
    this.cause = cause;
  }
}

export class InvalidModelError extends CustomError {}

export class UnknownPlayerError extends CustomError {
  constructor(player: string, cause?: Error) {
    super(`unknown player ${player}`, cause);
  }
}

export class GameLogicError extends CustomError {}
