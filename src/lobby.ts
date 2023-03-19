import { GameState } from './model/GameState';

const GAME_BOARD_DIMENSION = 5;

class LobbyPhaseStatus {
  status = 'lobby' as const;
  // Players in the lobby, will change as players join/leave
  players: string[];

  constructor(players: string[] = []) {
    this.players = [...players];
  }
}

class ActiveGamePhaseStatus {
  status = 'active_game' as const;
  gameState: GameState;

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }
}

class DisconnectedPlayerPhaseStatus {
  status = 'disconnected_player' as const;

  players: string[];
  missing_players: string[];

  constructor(players: string[], missing_players: string[]) {
    this.players = players;
    this.missing_players = missing_players;
  }
}

class ScoresPhaseStatus {
  status = 'scores' as const;
  scores: Record<string, number>;

  constructor(scores: Record<string, number>) {
    this.scores = scores;
  }
}

export type LobbyState =
  | LobbyPhaseStatus
  | ActiveGamePhaseStatus
  | DisconnectedPlayerPhaseStatus
  | ScoresPhaseStatus;

export class Lobby {
  #state: LobbyState;

  constructor(state: LobbyState) {
    this.#state = state;
  }
}
