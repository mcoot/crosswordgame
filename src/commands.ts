// Commands a player can issue within a lobby
export enum CommandKind {
  // For the leader, start the game
  START_GAME = 'start_game',
  // Announce a letter
  ANNOUNCE = 'announce',
  // Place the current announced letter
  PLACE = 'place',
  // Indicate a player is ready for scores to be revealed
  READY_SHOW_SCORES = 'ready_show_scores',
  // For the leader, reset the lobby
  RESET_LOBBY = 'reset_lobby',
  // Indicate a player is ready to continue play without a disconnected player
  READY_CONTINUE_PLAY_WITHOUT_PLAYER = 'ready_continue_play_without_player',
}

interface StartGameCommand {
  kind: CommandKind.START_GAME;
}

interface AnnounceCommand {
  kind: CommandKind.ANNOUNCE;
  letter: string;
}

interface PlaceCommand {
  kind: CommandKind.PLACE;
  pos: [number, number];
}

interface ReadyShowScoresCommand {
  kind: CommandKind.READY_SHOW_SCORES;
}

interface ResetLobbyCommand {
  kind: CommandKind.RESET_LOBBY;
}

interface ReadyContinuePlayWithoutPlayerCommand {
  kind: CommandKind.READY_CONTINUE_PLAY_WITHOUT_PLAYER;
}

export type Command =
  | StartGameCommand
  | AnnounceCommand
  | PlaceCommand
  | ReadyShowScoresCommand
  | ResetLobbyCommand
  | ReadyContinuePlayWithoutPlayerCommand;
