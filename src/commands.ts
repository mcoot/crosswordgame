// For the leader, start the game
interface StartGameCommand {
  kind: 'start_game';
}

// Announce a letter
interface AnnounceCommand {
  kind: 'announce';
  letter: string;
}

// Place the current announced letter
interface PlaceCommand {
  kind: 'place';
  pos: [number, number];
}

// Indicate a player is ready for scores to be revealed
interface ReadyShowScoresCommand {
  kind: 'ready_show_scores';
}

// For the leader, reset the lobby
interface ResetLobbyCommand {
  kind: 'reset_lobby';
}

// Indicate a player is ready to continue play without a disconnected player
interface ReadyContinuePlayWithoutPlayerCommand {
  kind: 'ready_continue_play_without_player';
}

export type Command =
  | StartGameCommand
  | AnnounceCommand
  | PlaceCommand
  | ReadyShowScoresCommand
  | ResetLobbyCommand
  | ReadyContinuePlayWithoutPlayerCommand;
