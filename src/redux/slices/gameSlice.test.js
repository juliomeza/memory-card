import { configureStore } from '@reduxjs/toolkit';
import gameReducer, {
  setLevel,
  clearError,
  initializeGame,
  updateScore,
  nextGroup
} from './gameSlice';

jest.mock('../../services/gameService', () => ({
  getConceptsForReview: jest.fn()
}));

jest.mock('../../services/userProgressManager', () => ({
  getLevelProgress: jest.fn(),
  updateUserProgress: jest.fn(),
  updateLevelProgress: jest.fn()
}));

const createMockStore = (initialState) => {
  return configureStore({
    reducer: { game: gameReducer },
    preloadedState: initialState
  });
};

describe('gameSlice', () => {
  describe('reducer, actions and selectors', () => {
    it('should return the initial state on first run', () => {
      const nextState = gameReducer(undefined, {});
      expect(nextState).toEqual({
        level: 1000,
        concepts: [],
        currentGroup: [],
        remainingConcepts: [],
        groupIndex: 0,
        showGroupSummary: false,
        correctCount: 0,
        progressCount: 0,
        hasStartedCounting: false,
        starColorIndex: 0,
        isLoading: false,
        error: null,
        levelProgress: { completed: 0, total: 0 },
      });
    });

    it('should properly set the level', () => {
      const nextState = gameReducer(undefined, setLevel(2000));
      expect(nextState.level).toBe(2000);
    });

    it('should properly clear the error', () => {
      const initialState = { ...gameReducer(undefined, {}), error: 'Some error' };
      const nextState = gameReducer(initialState, clearError());
      expect(nextState.error).toBeNull();
    });
  });

  describe('async actions', () => {
    it('creates proper actions when initializeGame is done', async () => {
      const mockConcepts = [{ id: '1', concept: 'Test' }];
      const mockLevelProgress = { completed: 0, total: 1 };
      const store = createMockStore({});

      require('../../services/gameService').getConceptsForReview.mockResolvedValue(mockConcepts);
      require('../../services/userProgressManager').getLevelProgress.mockResolvedValue(mockLevelProgress);

      await store.dispatch(initializeGame({ userId: '123', level: 1000 }));

      const state = store.getState().game;
      expect(state.concepts).toEqual(mockConcepts);
      expect(state.level).toBe(1000);
      expect(state.levelProgress).toEqual(mockLevelProgress);
    });

    it('creates proper actions when updateScore is done', async () => {
      const initialState = {
        game: {
          correctCount: 0,
          remainingConcepts: [{ id: '1' }]
        }
      };
      const store = createMockStore(initialState);

      require('../../services/userProgressManager').updateUserProgress.mockResolvedValue();

      await store.dispatch(updateScore({ userId: '123', conceptId: '1', isCorrect: true }));

      const state = store.getState().game;
      expect(state.correctCount).toBe(1);
      expect(state.remainingConcepts).toHaveLength(0);
    });

    it('creates proper actions when nextGroup is done', async () => {
      const initialState = {
        game: {
          groupIndex: 0,
          concepts: ['1', '2', '3', '4', '5', '6'],
          levelProgress: { completed: 0, total: 2 }
        }
      };
      const store = createMockStore(initialState);

      require('../../services/userProgressManager').updateLevelProgress.mockResolvedValue();

      await store.dispatch(nextGroup({ userId: '123', level: 1000 }));

      const state = store.getState().game;
      expect(state.groupIndex).toBe(1);
      expect(state.levelProgress.completed).toBe(1);
    });
  });
});