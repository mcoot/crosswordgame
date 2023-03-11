import { BoundsCheckError } from '../validation/bounds-checking';
import {
  GameLogicError,
  InvalidModelError,
  UnknownPlayerError,
} from '../validation/custom-errors';
import {
  AnnouncingGameStatus,
  GameState,
  PlacingGameStatus,
} from './GameState';
import { Grid } from './Grid';

describe('model/GameState', () => {
  describe('PlacingGameStatus', () => {
    describe('construction', () => {
      it('throws if letter to place is not a single character', () => {
        expect(() => new PlacingGameStatus('potato')).toThrowError(
          InvalidModelError,
        );
      });
    });
  });

  describe('GameState', () => {
    describe('construction', () => {
      it('fails validation if no players are present', () => {
        expect(
          () => new GameState([], 'p1', new AnnouncingGameStatus(), {}),
        ).toThrowError(InvalidModelError);
      });

      it('fails validation if current announcing player is not in the players list', () => {
        expect(
          () =>
            new GameState(
              ['p1', 'p2', 'p3'],
              'p4',
              new AnnouncingGameStatus(),
              {
                p1: Grid.empty(5),
                p2: Grid.empty(5),
                p3: Grid.empty(5),
              },
            ),
        ).toThrowError(InvalidModelError);
      });

      it('fails validation if a grid exists for a player not in the game', () => {
        expect(
          () =>
            new GameState(
              ['p1', 'p2', 'p3'],
              'p2',
              new AnnouncingGameStatus(),
              {
                p1: Grid.empty(5),
                p2: Grid.empty(5),
                p3: Grid.empty(5),
                p4: Grid.empty(5),
              },
            ),
        ).toThrowError(InvalidModelError);
      });

      it('fails validation if a player in the game is missing a grid', () => {
        expect(
          () =>
            new GameState(
              ['p1', 'p2', 'p3'],
              'p2',
              new AnnouncingGameStatus(),
              {
                p1: Grid.empty(5),
                p2: Grid.empty(5),
              },
            ),
        ).toThrowError(InvalidModelError);
      });

      it('constructs successfully', () => {
        expect(
          () =>
            new GameState(
              ['p1', 'p2', 'p3'],
              'p2',
              new AnnouncingGameStatus(),
              {
                p1: Grid.empty(5),
                p2: Grid.empty(5),
                p3: Grid.empty(5),
              },
            ),
        ).not.toThrow();
      });
    });

    describe('static methods', () => {
      describe('initial', () => {
        it('fails with model error if no players present', () => {
          expect(() => GameState.initial([], 5)).toThrowError(
            InvalidModelError,
          );
        });

        it('fails if grid construction fails', () => {
          expect(() => GameState.initial([], 2.5)).toThrowError(
            InvalidModelError,
          );
        });

        it('successfully creates the initial state', () => {
          const result = GameState.initial(['p1', 'p2', 'p3'], 5);
          expect(result.players).toEqual(['p1', 'p2', 'p3']);
          expect(result.currentAnnouncingPlayer).toEqual('p1');
          expect(result.currentGameStatus.status).toEqual('announcing');
          expect(result.gridFor('p1').all((c) => c === '')).toBe(true);
          expect(result.gridFor('p2').all((c) => c === '')).toBe(true);
          expect(result.gridFor('p3').all((c) => c === '')).toBe(true);
        });
      });
    });

    describe('instance methods', () => {
      let gameState: GameState;
      beforeEach(() => {
        gameState = GameState.initial(['p1', 'p2', 'p3'], 5);
      });

      describe('nextAnnouncingPlayer', () => {
        it('returns the next player in the list', () => {
          expect(gameState.nextAnnouncingPlayer()).toBe('p2');
        });

        it('wraps back to the first player', () => {
          gameState = new GameState(
            ['p1', 'p2', 'p3'],
            'p3',
            new PlacingGameStatus('a', []),
            { p1: Grid.empty(2), p2: Grid.empty(2), p3: Grid.empty(2) },
          );
          expect(gameState.nextAnnouncingPlayer()).toBe('p1');
        });
      });

      describe('gridFor', () => {
        it('throws if unknown player given', () => {
          expect(() => gameState.gridFor('p4')).toThrowError(
            UnknownPlayerError,
          );
        });

        it('returns the grid', () => {
          const grid = gameState.gridFor('p2');
          // All empty since initial
          expect(grid.all((c) => c === '')).toBe(true);
        });
      });

      describe('areGridsFull', () => {
        it('returns false when all grids are non-full', () => {
          gameState = new GameState(
            ['p1', 'p2'],
            'p1',
            new PlacingGameStatus('a', []),
            { p1: Grid.empty(2), p2: Grid.empty(2) },
          );
          expect(gameState.areGridsFull).toBe(false);
        });

        it('returns false when one grid is non-full', () => {
          gameState = new GameState(
            ['p1', 'p2'],
            'p1',
            new PlacingGameStatus('a', []),
            {
              p1: new Grid(2, [
                ['a', 'b'],
                ['c', 'd'],
              ]),
              p2: new Grid(2, [
                ['a', ''],
                ['c', 'd'],
              ]),
            },
          );
          expect(gameState.areGridsFull).toBe(false);
        });

        it('returns true when all grids are full', () => {
          gameState = new GameState(
            ['p1', 'p2'],
            'p1',
            new PlacingGameStatus('a', []),
            {
              p1: new Grid(2, [
                ['a', 'b'],
                ['c', 'd'],
              ]),
              p2: new Grid(2, [
                ['a', 'b'],
                ['c', 'd'],
              ]),
            },
          );
          expect(gameState.areGridsFull).toBe(true);
        });
      });

      describe('placeLetter', () => {
        beforeEach(() => {
          gameState = new GameState(
            ['p1', 'p2'],
            'p1',
            new PlacingGameStatus('a', []),
            { p1: Grid.empty(5), p2: Grid.empty(5) },
          );
        });

        it('throws if not in placing mode', () => {
          gameState = GameState.initial(['p1', 'p2'], 5);
          expect(() => gameState.placeLetter('p1', [0, 0])).toThrow(
            GameLogicError,
          );
        });

        it('throws if invalid player provided', () => {
          expect(() => gameState.placeLetter('potato', [0, 0])).toThrow(
            UnknownPlayerError,
          );
        });

        it('throws if player has already placed in this round', () => {
          gameState.placeLetter('p1', [0, 0]);
          expect(() => gameState.placeLetter('p1', [1, 1])).toThrowError(
            GameLogicError,
          );
        });

        it('throws if placing out of bounds', () => {
          expect(() => gameState.placeLetter('p1', [-1, -1])).toThrowError(
            BoundsCheckError,
          );
        });

        it('places letter and marks player complete', () => {
          gameState.placeLetter('p1', [0, 0]);
          expect(
            (
              gameState.currentGameStatus as PlacingGameStatus
            ).playersComplete.has('p1'),
          ).toBe(true);
        });
      });

      describe('processAnnouncement', () => {
        it('throws if not in announcing state', () => {
          gameState = new GameState(
            ['p1', 'p2'],
            'p1',
            new PlacingGameStatus('a', []),
            { p1: Grid.empty(5), p2: Grid.empty(5) },
          );

          expect(() => gameState.processAnnouncement('a')).toThrowError(
            GameLogicError,
          );
        });

        it('throws if announcement is empty', () => {
          expect(() => gameState.processAnnouncement('')).toThrowError(
            InvalidModelError,
          );
        });

        it('throws if announcement is multiple characters', () => {
          expect(() => gameState.processAnnouncement('aaa')).toThrowError(
            InvalidModelError,
          );
        });

        it('transitions status to placing', () => {
          gameState.processAnnouncement('a');
          expect(gameState.currentGameStatus.status).toBe('placing');
        });
      });

      describe('finishPlacement', () => {
        it('throws if not in placing mode', () => {
          gameState = new GameState(
            ['p1', 'p2'],
            'p1',
            new AnnouncingGameStatus(),
            { p1: Grid.empty(5), p2: Grid.empty(5) },
          );
          expect(() => gameState.finishPlacement()).toThrowError(
            GameLogicError,
          );
        });

        it('throws if not all players have placed', () => {
          gameState = new GameState(
            ['p1', 'p2'],
            'p1',
            new PlacingGameStatus('a', []),
            { p1: Grid.empty(5), p2: Grid.empty(5) },
          );
          expect(() => gameState.finishPlacement()).toThrowError(
            GameLogicError,
          );
        });

        it('moves to announcing state with next player', () => {
          gameState = new GameState(
            ['p1', 'p2'],
            'p1',
            new PlacingGameStatus('a', ['p1', 'p2']),
            {
              p1: new Grid(2, [
                ['a', ''],
                ['c', 'd'],
              ]),
              p2: new Grid(2, [
                ['a', 'b'],
                ['c', ''],
              ]),
            },
          );
          gameState.finishPlacement();

          expect(gameState.currentGameStatus.status).toBe('announcing');
          expect(gameState.currentAnnouncingPlayer).toBe('p2');
        });

        it('moves to complete if all grids are full', () => {
          gameState = new GameState(
            ['p1', 'p2'],
            'p1',
            new PlacingGameStatus('a', ['p1', 'p2']),
            {
              p1: new Grid(2, [
                ['a', 'b'],
                ['c', 'd'],
              ]),
              p2: new Grid(2, [
                ['a', 'b'],
                ['c', 'd'],
              ]),
            },
          );
          gameState.finishPlacement();

          expect(gameState.currentGameStatus.status).toBe('complete');
        });
      });
    });
  });
});
