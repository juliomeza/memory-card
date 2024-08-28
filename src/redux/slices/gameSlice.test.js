import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import gameReducer, {
  setLevel,
  clearError,
  initializeGame,
  updateScore,
  nextGroup
} from './gameSlice';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

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
      const level = 2000;
      const nextState = gameReducer(undefined, setLevel(level));
      expect(nextState.level).toEqual(level);
    });

    it('should properly clear the error', () => {
      const initialState = { ...gameReducer(undefined, {}), error: 'Test error' };
      const nextState = gameReducer(initialState, clearError());
      expect(nextState.error).toBeNull();
    });
  });

  describe('async actions', () => {
    it('creates proper actions when initializeGame is done', () => {
      const mockConcepts = [{ id: '1', concept: 'Test' }];
      const mockLevelProgress = { completed: 0, total: 1 };
      const expectedActions = [
        { type: 'game/initializeGame/pending' },
        { type: 'game/initializeGame/fulfilled', payload: { concepts: mockConcepts, level: 1000, levelProgress: mockLevelProgress } }
      ];
      const store = mockStore({});

      // Mock the necessary functions
      jest.mock('../../services/gameService', () => ({
        getConceptsForReview: jest.fn(() => Promise.resolve(mockConcepts)),
      }));
      jest.mock('../../services/userProgressManager', () => ({
        getLevelProgress: jest.fn(() => Promise.resolve(mockLevelProgress)),
      }));

      return store.dispatch(initializeGame({ userId: '123', level: 1000 })).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('creates proper actions when updateScore is done', () => {
      const expectedActions = [
        { type: 'game/updateScore/pending' },
        { type: 'game/updateScore/fulfilled', payload: true }
      ];
      const store = mockStore({
        game: {
          correctCount: 0,
          remainingConcepts: [{ id: '1' }]
        }
      });

      // Mock the necessary functions
      jest.mock('../../services/userProgressManager', () => ({
        updateUserProgress: jest.fn(() => Promise.resolve()),
      }));

      return store.dispatch(updateScore({ userId: '123', conceptId: '1', isCorrect: true })).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('creates proper actions when nextGroup is done', () => {
      const mockLevelProgress = { completed: 1, total: 2 };
      const expectedActions = [
        { type: 'game/nextGroup/pending' },
        { type: 'game/nextGroup/fulfilled', payload: { groupIndex: 1, levelProgress: mockLevelProgress } }
      ];
      const store = mockStore({
        game: {
          groupIndex: 0,
          concepts: ['1', '2', '3', '4', '5', '6'],
          levelProgress: { completed: 0, total: 2 }
        }
      });

      // Mock the necessary functions
      jest.mock('../../services/userProgressManager', () => ({
        updateLevelProgress: jest.fn(() => Promise.resolve()),
      }));

      return store.dispatch(nextGroup({ userId: '123', level: 1000 })).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});