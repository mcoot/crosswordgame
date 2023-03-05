import {
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

      describe('placeLetter', () => {
        it.todo('throws if not in placing mode');

        it.todo('throws if invalid player provided');

        it.todo('throws if player has already placed in this round');

        it.todo('throws if placing out of bounds');

        it.todo('places letter and marks player complete');
      });
    });
  });
});
