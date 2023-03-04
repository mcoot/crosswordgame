import {
  InvalidModelError,
  UnknownPlayerError,
} from '../validation/custom-errors';
import { MutableGrid, Grid } from './Grid';

type GameStatus = 'announcing' | 'placing' | 'complete';

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

    return new GameState(players, players[0], 'announcing', grids);
  }
}
