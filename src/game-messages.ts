import { Grid } from './model/Grid';

interface MessageWithGrid {
  grid: Grid;
}

// Sent when the game enters announcement mode
interface EnteringAnnouncementModeMessage extends MessageWithGrid {
  kind: 'entering_announcement_mode';
  announcingPlayer: string;
}

// Sent when a letter is announced and placement begins
interface EnteringPlacementModeMessage extends MessageWithGrid {
  kind: 'entering_placement_mode';
  letter: string;
}

// Sent when a placement command is confirmed as being accepted
interface PlacementAckMessage {
  kind: 'placement_ack';
}

// Sent when the game is completed
interface GameCompletedMessage extends MessageWithGrid {
  kind: 'game_completed';
}

export type GameMessage =
  | EnteringAnnouncementModeMessage
  | EnteringPlacementModeMessage
  | PlacementAckMessage
  | GameCompletedMessage;
