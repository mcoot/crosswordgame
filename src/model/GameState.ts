import {
  InvalidModelError,
  UnknownPlayerError,
} from '../validation/custom-errors';
import { MutableGrid, Grid } from './Grid';

export class AnnouncingGameStatus {
  readonly status = 'announcing' as const;
}

export class PlacingGameStatus {
  readonly status = 'placing' as const;
  readonly letterToPlace: string;
  readonly playersComplete: Set<string>;

  constructor(letterToPlace: string, playersComplete: string[] = []) {
    if (letterToPlace.length !== 1) {
      throw new InvalidModelError(
        'letter to place may only be a single character',
      );
    }
    this.letterToPlace = letterToPlace;
    this.playersComplete = new Set(playersComplete);
  }

  markPlayerComplete(player: string): void {
    this.playersComplete.add(player);
  }
}

export class CompleteGameStatus {
  readonly status = 'complete' as const;
}

export type GameStatus =
  | AnnouncingGameStatus
  | PlacingGameStatus
  | CompleteGameStatus;

export class GameState {
  readonly players: string[];
  #currentAnnouncingPlayer: string;
  #currentGameStatus: GameStatus;
  #grids: Record<string, MutableGrid>;

  constructor(
    players: string[],
    currentAnnouncingPlayer: string,
    currentGameStatus: GameStatus,
    grids: Record<string, MutableGrid>,
  ) {
    if (players.length === 0) {
      throw new InvalidModelError('cannot create game state with no players');
    }
    if (!players.includes(currentAnnouncingPlayer)) {
      throw new InvalidModelError(
        `current announcing player ${currentAnnouncingPlayer} is not in the player list`,
      );
    }
    if (
      players.length !== Object.keys(grids).length ||
      players.some((p) => !Object.keys(grids).includes(p))
    ) {
      throw new InvalidModelError(
        'provided game state grids did not match players',
      );
    }

    this.players = players;
    this.#currentAnnouncingPlayer = currentAnnouncingPlayer;
    this.#currentGameStatus = currentGameStatus;
    this.#grids = { ...grids };
  }

  get currentAnnouncingPlayer(): string {
    return this.#currentAnnouncingPlayer;
  }

  get currentGameStatus(): GameStatus {
    return this.#currentGameStatus;
  }

  gridFor(player: string): Grid {
    if (!this.players.includes(player)) {
      throw new UnknownPlayerError(player);
    }

    return this.#grids[player];
  }

  static initial(players: string[], gridDimension: number): GameState {
    if (players.length === 0) {
      throw new InvalidModelError('cannot create game state with no players');
    }

    const grids: Record<string, MutableGrid> = players.reduce(
      (acc, p) => ({ ...acc, [p]: MutableGrid.empty(gridDimension) }),
      {},
    );

    return new GameState(
      players,
      players[0],
      new AnnouncingGameStatus(),
      grids,
    );
  }
}
