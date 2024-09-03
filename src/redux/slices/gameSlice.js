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
    }
    if (!levelProgress || levelProgress.total === 0) {
      const totalGroups = Math.ceil(concepts.length / 5);
      levelProgress = { completed: 0, total: totalGroups };
      if (userId) {
        await updateLevelProgress(userId, level, 0, totalGroups);
      }
    }
    console.log('Level progress:', levelProgress);
    return { concepts, level, levelProgress };
  }
);

export const updateScore = createAsyncThunk(
  'game/updateScore',
  async ({ userId, conceptId, isCorrect }, { getState, dispatch }) => {
    console.log('Updating score for user:', userId, 'concept:', conceptId, 'correct:', isCorrect);
    const state = getState().game;
    let newLevelProgress = null;

    if (isCorrect && state.correctCount + 1 === 5) {
      dispatch(gameSlice.actions.showGroupSummary());
      const newCompleted = state.levelProgress.completed + 1;
      newLevelProgress = { 
        completed: newCompleted, 
        total: state.levelProgress.total 
      };

      if (userId) {
        await updateUserProgress(userId, conceptId, isCorrect);
        await updateLevelProgress(userId, state.level, newCompleted, state.levelProgress.total);
      }
    } else if (userId) {
      await updateUserProgress(userId, conceptId, isCorrect);
    }

    return { isCorrect, newLevelProgress };
  }
);

export const nextGroup = createAsyncThunk(
  'game/nextGroup',
  async ({ userId, level }, { getState }) => {
    const { groupIndex, concepts, levelProgress } = getState().game;
    const newGroupIndex = groupIndex + 1;
    console.log('Moving to next group:', newGroupIndex, 'for user:', userId);
    if (newGroupIndex * 5 < concepts.length) {
      let newLevelProgress = { 
        completed: levelProgress.completed, // Mantener el progreso actual
        total: levelProgress.total
      };
      if (userId) {
        // Solo actualizamos en la base de datos, no incrementamos aquí
        const updatedProgress = await updateLevelProgress(userId, level, newLevelProgress.completed, newLevelProgress.total);
        newLevelProgress = updatedProgress;
      }
      return { 
        groupIndex: newGroupIndex, 
        levelProgress: newLevelProgress
      };
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
    incrementLevelProgress: (state) => {
      state.levelProgress.completed += 1;
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
      .addCase(updateScore.fulfilled, (state, action) => {
        if (action.payload.isCorrect) {
          state.correctCount++;
          state.progressCount++;
          state.remainingConcepts.shift();
          if (state.correctCount === 5) {
            // Incrementar el progreso del nivel cuando se completa un grupo
            state.levelProgress.completed += 1;
          }
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
          // Mantener el progreso del nivel actual
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

export const { setLevel, clearError, incrementLevelProgress } = gameSlice.actions;

export default gameSlice.reducer;