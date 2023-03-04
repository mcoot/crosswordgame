import { InvalidModelError } from '../validation/custom-errors';
import { Grid } from './Grid';

type GameStatus = 'announcing' | 'placing' | 'complete';

export class GameState {
  #players: string[];
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

    this.#players = players;
    this.#currentAnnouncingPlayer = currentAnnouncingPlayer;
    this.#currentGameStatus = currentGameStatus;
    this.#grids = { ...grids };
  }

  static initial(players: string[], gridDimension: number): GameState {
    if (players.length === 0) {
      throw new InvalidModelError('cannot create game state with no players');
    }

    const grids: Record<string, Grid> = players.reduce(
      (acc, p) => ({ ...acc, [p]: Grid.empty(gridDimension) }),
      {},
    );

    return new GameState(players, players[0], 'announcing', grids);
  }
}
