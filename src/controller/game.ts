import { GameState } from '../model/GameState';

const GAME_BOARD_DIMENSION = 5;

export class Game {
  #state: GameState;

  constructor(players: string[]) {
    this.#state = GameState.initial(players, GAME_BOARD_DIMENSION);
  }
}