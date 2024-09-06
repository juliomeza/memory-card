import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getConceptsForReview  } from '../../services/gameService';
import { updateUserProgress, updateCategoryProgress, getCategoryProgress } from '../../services/userProgressManager';

export const initializeGame = createAsyncThunk(
  'game/initializeGame',
  async ({ userId, category }, { dispatch }) => {
    console.log('Initializing game for user:', userId, 'category:', category);
    const concepts = await getConceptsForReview(userId, category);
    let categoryProgress;
    if (userId) {
      categoryProgress = await getCategoryProgress(userId, category);
    }
    if (!categoryProgress || categoryProgress.total === 0) {
      const totalGroups = Math.ceil(concepts.length / 5);
      categoryProgress = { completed: 0, total: totalGroups };
      if (userId) {
        await updateCategoryProgress(userId, category, 0, totalGroups);
      }
    }
    console.log('Category progress:', categoryProgress);
    return { concepts, category, categoryProgress };
  }
);

export const updateScore = createAsyncThunk(
  'game/updateScore',
  async ({ userId, conceptId, isCorrect }, { getState, dispatch }) => {
    console.log('Updating score for user:', userId, 'concept:', conceptId, 'correct:', isCorrect);
    const state = getState().game;
    let newCategoryProgress = null;

    if (isCorrect && state.correctCount + 1 === 5) {
      dispatch(gameSlice.actions.showGroupSummary());
      const newCompleted = state.categoryProgress.completed + 1;
      newCategoryProgress = { 
        completed: newCompleted, 
        total: state.categoryProgress.total 
      };

      if (userId) {
        await updateUserProgress(userId, conceptId, isCorrect);
        await updateCategoryProgress(userId, state.category, newCompleted, state.categoryProgress.total);
      }
    } else if (userId) {
      await updateUserProgress(userId, conceptId, isCorrect);
    }

    return { isCorrect, newCategoryProgress };
  }
);

export const nextGroup = createAsyncThunk(
  'game/nextGroup',
  async ({ userId, category }, { getState }) => {
    const { groupIndex, concepts, categoryProgress } = getState().game;
    const newGroupIndex = groupIndex + 1;
    console.log('Moving to next group:', newGroupIndex, 'for user:', userId);
    if (newGroupIndex * 5 < concepts.length) {
      let newCategoryProgress = { 
        completed: categoryProgress.completed, // Mantener el progreso actual
        total: categoryProgress.total
      };
      if (userId) {
        // Solo actualizamos en la base de datos, no incrementamos aquí
        const updatedProgress = await updateCategoryProgress(userId, category, newCategoryProgress.completed, newCategoryProgress.total);
        newCategoryProgress = updatedProgress;
      }
      return { 
        groupIndex: newGroupIndex, 
        categoryProgress: newCategoryProgress
      };
    }
    return null;
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    category: '',
    categories: [],
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
    categoryProgress: { completed: 0, total: 0 },
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    showGroupSummary: (state) => {
      state.showGroupSummary = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    incrementCategoryProgress: (state) => {
      state.categoryProgress.completed += 1;
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
        state.currentGroup = state.concepts.slice(0, 5);
        state.remainingConcepts = [...state.currentGroup];
        state.groupIndex = 0;
        state.showGroupSummary = false;
        state.correctCount = 0;
        state.progressCount = 0;
        state.hasStartedCounting = false;
        state.categoryProgress = action.payload.categoryProgress;
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
            state.categoryProgress.completed += 1;
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
          state.categoryProgress = action.payload.categoryProgress;
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

export const { clearError, incrementCategoryProgress, setCategories, setCategory } = gameSlice.actions;

export default gameSlice.reducer;