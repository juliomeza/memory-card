import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getConceptsForReview } from '../../services/gameService';
import { updateUserProgress, updateLevelProgress, getLevelProgress } from '../../services/userProgressManager';

export const initializeGame = createAsyncThunk(
  'game/initializeGame',
  async ({ userId, level }, { dispatch }) => {
    console.log('Initializing game for user:', userId, 'level:', level);
    const concepts = await getConceptsForReview(userId, level);
    let levelProgress;
    if (userId) {
      levelProgress = await getLevelProgress(userId, level);
    } else {
      levelProgress = { completed: 0, total: Math.ceil(concepts.length / 5) };
    }
    console.log('Level progress:', levelProgress);
    return { concepts, level, levelProgress };
  }
);

export const updateScore = createAsyncThunk(
  'game/updateScore',
  async ({ userId, conceptId, isCorrect }, { getState, dispatch }) => {
    console.log('Updating score for user:', userId, 'concept:', conceptId, 'correct:', isCorrect);
    if (userId) {
      await updateUserProgress(userId, conceptId, isCorrect);
    }
    const state = getState().game;
    if (isCorrect && state.correctCount + 1 === 5) {
      dispatch(gameSlice.actions.showGroupSummary());
    }
    return isCorrect;
  }
);

export const nextGroup = createAsyncThunk(
  'game/nextGroup',
  async ({ userId, level }, { getState }) => {
    const { groupIndex, concepts, levelProgress } = getState().game;
    const newGroupIndex = groupIndex + 1;
    console.log('Moving to next group:', newGroupIndex, 'for user:', userId);
    if (newGroupIndex * 5 < concepts.length) {
      const newCompleted = newGroupIndex;
      const newTotal = Math.ceil(concepts.length / 5);
      if (userId) {
        await updateLevelProgress(userId, level, newCompleted, newTotal);
      }
      console.log('New level progress:', { completed: newCompleted, total: newTotal });
      return { groupIndex: newGroupIndex, levelProgress: { completed: newCompleted, total: newTotal } };
    }
    return null;
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState: {
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
  },
  reducers: {
    setLevel: (state, action) => {
      state.level = action.payload;
    },
    showGroupSummary: (state) => {
      state.showGroupSummary = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.concepts = action.payload.concepts;
        state.level = action.payload.level;
        state.currentGroup = state.concepts.slice(0, 5);
        state.remainingConcepts = [...state.currentGroup];
        state.groupIndex = 0;
        state.showGroupSummary = false;
        state.correctCount = 0;
        state.progressCount = 0;
        state.hasStartedCounting = false;
        state.levelProgress = action.payload.levelProgress;
        state.error = null;
      })
      .addCase(initializeGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to initialize game';
      })
      .addCase(updateScore.pending, (state) => {
        state.error = null;
      })
      .addCase(updateScore.fulfilled, (state, action) => {
        if (action.payload) {
          state.correctCount++;
          state.progressCount++;
          state.remainingConcepts.shift();
        } else {
          const [incorrectConcept, ...rest] = state.remainingConcepts;
          state.remainingConcepts = [...rest, incorrectConcept];
        }
        state.hasStartedCounting = true;
        state.error = null;
      })
      .addCase(updateScore.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update score';
      })
      .addCase(nextGroup.pending, (state) => {
        state.error = null;
      })
      .addCase(nextGroup.fulfilled, (state, action) => {
        if (action.payload !== null) {
          state.groupIndex = action.payload.groupIndex;
          state.currentGroup = state.concepts.slice(state.groupIndex * 5, (state.groupIndex + 1) * 5);
          state.remainingConcepts = [...state.currentGroup];
          state.showGroupSummary = false;
          state.correctCount = 0;
          state.progressCount = 0;
          state.hasStartedCounting = false;
          state.starColorIndex = (state.starColorIndex + 1) % 5;
          state.levelProgress = action.payload.levelProgress;
        } else {
          // Handle game completion
          state.showGroupSummary = false;
          state.remainingConcepts = [];
        }
        state.error = null;
      })
      .addCase(nextGroup.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to move to next group';
      });
  },
});

export const { setLevel, clearError } = gameSlice.actions;

export default gameSlice.reducer;