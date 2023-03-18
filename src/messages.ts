// Messages the server may send to a player in the course of an active game
export enum GameMessageKind {
  // Sent when the game enters announcement mode
  ENTERING_ANNOUNCEMENT_MODE = 'entering_announcement_mode',
  // Sent when a letter is announced and placement begins
  ENTERING_PLACEMENT_MODE = 'entering_placement_mode',
  // Sent when a placement command is confirmed as being accepted
  PLACEMENT_ACK = 'placement_ack',
  // Sent when the game is completed
  GAME_COMPLETED = 'game_completed',
}

interface EnteringAnnouncementModeMessage {
  kind: GameMessageKind.ENTERING_ANNOUNCEMENT_MODE;
  announcingPlayer: string;
}

interface EnteringPlacementModeMessage {
  kind: GameMessageKind.ENTERING_PLACEMENT_MODE;
  letter: string;
}

interface PlacementAckMessage {
  kind: GameMessageKind.PLACEMENT_ACK;
}

interface GameCompletedMessage {
  kind: GameMessageKind.GAME_COMPLETED;
}

export type GameMessage =
  | EnteringAnnouncementModeMessage
  | EnteringPlacementModeMessage
  | PlacementAckMessage
  | GameCompletedMessage;

export enum LobbyMessageKind {
  // Sent when a client is entering a lobby, or returning to lobby after a game
  ENTERING_LOBBY_PHASE = 'entering_lobby_phase',
  // Sent when entering an active game due to game start, player rejoin or continue-without-player
  ENTERING_ACTIVE_GAME = 'entering_active_game',
  // Sent when entering a paused state due to player disconnect
  ENTERING_DISCONNECT_PHASE = 'entering_disconnect_phase',
  // Sent when entering the post-game scores screen
  ENTERING_SCORES_PHASE = 'entering_scores_phase',
  // Sent when the lobby is terminating
  ENDING_LOBBY = 'ending_lobby',
}

interface EnteringLobbyPhaseMessage {
  kind: LobbyMessageKind.ENTERING_LOBBY_PHASE;
  players: string[];
}

interface EnteringActiveGameMessage {
  kind: LobbyMessageKind.ENTERING_ACTIVE_GAME;
  players: string[];
}

interface EnteringDisconnectPhaseMessage {
  kind: LobbyMessageKind.ENTERING_DISCONNECT_PHASE;
  disconnectedPlayers: string[];
}

interface EnteringScoresPhaseMessage {
  kind: LobbyMessageKind.ENTERING_SCORES_PHASE;
  scores: Record<string, number>;
}

interface EndingLobbyMessage {
  kind: LobbyMessageKind.ENDING_LOBBY;
}

export type LobbyMessage =
  | EnteringLobbyPhaseMessage
  | EnteringActiveGameMessage
  | EnteringDisconnectPhaseMessage
  | EnteringScoresPhaseMessage
  | EndingLobbyMessage;
