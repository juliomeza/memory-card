import {
  selectUser,
  selectIsAnonymous,
  selectIsAuthLoading,
  selectAuthError,
  selectLevel,
  selectCurrentGroup,
  selectShowGroupSummary,
  selectCorrectCount,
  selectRemainingConcepts,
  selectHasStartedCounting,
  selectProgressCount,
  selectStarColorIndex,
  selectIsGameLoading,
  selectLevelProgress,
  selectGameData
} from './selectors';

describe('Redux selectors', () => {
  const mockState = {
    auth: {
      user: { id: '123' },
      isAnonymous: false,
      isAuthLoading: false,
      authError: null
    },
    game: {
      level: 1000,
      currentGroup: ['1', '2', '3'],
      showGroupSummary: false,
      correctCount: 2,
      remainingConcepts: ['4', '5'],
      hasStartedCounting: true,
      progressCount: 3,
      starColorIndex: 1,
      isLoading: false,
      levelProgress: { completed: 1, total: 5 }
    }
  };

  it('should select user', () => {
    expect(selectUser(mockState)).toEqual({ id: '123' });
  });

  it('should select isAnonymous', () => {
    expect(selectIsAnonymous(mockState)).toBe(false);
  });

  it('should select isAuthLoading', () => {
    expect(selectIsAuthLoading(mockState)).toBe(false);
  });

  it('should select authError', () => {
    expect(selectAuthError(mockState)).toBeNull();
  });

  it('should select level', () => {
    expect(selectLevel(mockState)).toBe(1000);
  });

  it('should select currentGroup', () => {
    expect(selectCurrentGroup(mockState)).toEqual(['1', '2', '3']);
  });

  it('should select showGroupSummary', () => {
    expect(selectShowGroupSummary(mockState)).toBe(false);
  });

  it('should select correctCount', () => {
    expect(selectCorrectCount(mockState)).toBe(2);
  });

  it('should select remainingConcepts', () => {
    expect(selectRemainingConcepts(mockState)).toEqual(['4', '5']);
  });

  it('should select hasStartedCounting', () => {
    expect(selectHasStartedCounting(mockState)).toBe(true);
  });

  it('should select progressCount', () => {
    expect(selectProgressCount(mockState)).toBe(3);
  });

  it('should select starColorIndex', () => {
    expect(selectStarColorIndex(mockState)).toBe(1);
  });

  it('should select isGameLoading', () => {
    expect(selectIsGameLoading(mockState)).toBe(false);
  });

  it('should select levelProgress', () => {
    expect(selectLevelProgress(mockState)).toEqual({ completed: 1, total: 5 });
  });

  it('should select gameData', () => {
    expect(selectGameData(mockState)).toEqual({
      level: 1000,
      currentGroup: ['1', '2', '3'],
      showGroupSummary: false,
      correctCount: 2,
      remainingConcepts: ['4', '5'],
      hasStartedCounting: true,
      progressCount: 3,
      starColorIndex: 1,
      isLoading: false,
      levelProgress: { completed: 1, total: 5 }
    });
  });
});