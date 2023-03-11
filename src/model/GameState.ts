import {
  GameLogicError,
  InvalidModelError,
  UnknownPlayerError,
} from '../validation/custom-errors';
import { Grid } from './Grid';

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
  #grids: Record<string, Grid>;

  constructor(
    players: string[],
    currentAnnouncingPlayer: string,
    currentGameStatus: GameStatus,
    grids: Record<string, Grid>,
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

  nextAnnouncingPlayer(): string {
    const curIdx = this.players.indexOf(this.currentAnnouncingPlayer);
    return this.players[(curIdx + 1) % this.players.length];
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

  get areGridsFull(): boolean {
    return Object.values(this.#grids).every((g) => g.isFull);
  }

  placeLetter(player: string, pos: [number, number]) {
    if (this.currentGameStatus.status !== 'placing') {
      throw new GameLogicError(
        `attempting to place letter for player ${player} ` +
          `while in ${this.currentGameStatus.status} state`,
      );
    }
    if (!this.players.includes(player)) {
      throw new UnknownPlayerError(player);
    }
    if (this.currentGameStatus.playersComplete.has(player)) {
      throw new GameLogicError(
        `cannot place twice for player ${player} this round`,
      );
    }

    const grid = this.#grids[player];
    grid.place(this.currentGameStatus.letterToPlace, pos);
    this.currentGameStatus.markPlayerComplete(player);
  }

  processAnnouncement(announcedLetter: string) {
    if (this.currentGameStatus.status !== 'announcing') {
      throw new GameLogicError(
        `attempting to process announcement while in ${this.currentGameStatus.status} state`,
      );
    }
    if (announcedLetter.length !== 1) {
      throw new InvalidModelError(
        'letter to announce may only be a single character',
      );
    }

    this.#currentGameStatus = new PlacingGameStatus(announcedLetter);
  }

  // Slightly weird coupling of logic to the controller here
  // given the model could automatically move once the last player is marked
  // but going ahead with this for time, can correct the modelling later
  finishPlacement() {
    if (this.currentGameStatus.status !== 'placing') {
      throw new GameLogicError(
        `cannot finish placement while in ${this.currentGameStatus.status} state`,
      );
    }
    if (this.currentGameStatus.playersComplete.size < this.players.length) {
      throw new GameLogicError(
        'cannot finish placement when not all players have placed',
      );
    }

    this.#currentAnnouncingPlayer = this.nextAnnouncingPlayer();

    // If grids are now full, the game should transition to complete
    if (this.areGridsFull) {
      this.#currentGameStatus = new CompleteGameStatus();
    } else {
      this.#currentGameStatus = new AnnouncingGameStatus();
    }
  }

  static initial(players: string[], gridDimension: number): GameState {
    if (players.length === 0) {
      throw new InvalidModelError('cannot create game state with no players');
    }

    const grids: Record<string, Grid> = players.reduce(
      (acc, p) => ({ ...acc, [p]: Grid.empty(gridDimension) }),
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
