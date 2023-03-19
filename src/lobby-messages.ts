// Sent when a client is entering a lobby, a new player joined the lobby, or when returning to lobby after a game
interface LobbyPhaseMessage {
  kind: 'lobby_phase';
  players: string[];
}

// Sent when entering an active game due to game start, player rejoin or continue-without-player
interface EnteringActiveGameMessage {
  kind: 'entering_active_game';
  players: string[];
}

// Sent when entering a paused state due to player disconnect
interface EnteringDisconnectPhaseMessage {
  kind: 'entering_disconnect_phase';
  disconnectedPlayers: string[];
}

// Sent when entering the post-game scores screen
interface EnteringScoresPhaseMessage {
  kind: 'entering_scores_phase';
  scores: Record<string, number>;
}

// Sent when the lobby is terminating
interface EndingLobbyMessage {
  kind: 'ending_lobby';
}

export type LobbyMessage =
  | LobbyPhaseMessage
  | EnteringActiveGameMessage
  | EnteringDisconnectPhaseMessage
  | EnteringScoresPhaseMessage
  | EndingLobbyMessage;
