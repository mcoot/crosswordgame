// Messages the server may send to a player in the course of an active game
export enum GameMessageKind {
  // Sent when the game enters announcement mode
  ENTERING_ANNOUNCEMENT_MODE,
  // Sent when a letter is announced and placement begins
  ENTERING_PLACEMENT_MODE,
  // Sent when a placement command is confirmed as being accepted
  PLACEMENT_ACK,
  // Sent when the game is completed
  GAME_COMPLETED,
}

export enum LobbyMessageKind {
  // Sent when a client is entering a lobby, or returning to lobby after a game
  ENTERING_LOBBY_PHASE,
  // Sent when entering an active game due to game start, player rejoin or continue-without-player
  ENTERING_ACTIVE_GAME,
  // Sent when entering a paused state due to player disconnect
  ENTERING_DISCONNECT_PHASE,
  // Sent when entering the post-game scores screen
  ENTERING_SCORES_PHASE,
  // Sent when the lobby is terminating
  ENDING_LOBBY,
}
