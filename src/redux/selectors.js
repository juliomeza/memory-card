import { createSelector } from '@reduxjs/toolkit';

// Selector base para el estado de autenticación
const selectAuth = state => state.auth;

// Selector base para el estado del juego
const selectGame = state => state.game;

// Selectores memorizados para auth
export const selectUser = createSelector(
  [selectAuth],
  auth => auth.user
);

export const selectIsAnonymous = createSelector(
  [selectAuth],
  auth => auth.isAnonymous
);

export const selectIsAuthLoading = createSelector(
  [selectAuth],
  auth => auth.isAuthLoading
);

export const selectAuthError = createSelector(
  [selectAuth],
  auth => auth.authError
);

// Selectores memorizados para game
export const selectLevel = createSelector(
  [selectGame],
  game => game.level
);

export const selectCurrentGroup = createSelector(
  [selectGame],
  game => game.currentGroup
);

export const selectShowGroupSummary = createSelector(
  [selectGame],
  game => game.showGroupSummary
);

export const selectCorrectCount = createSelector(
  [selectGame],
  game => game.correctCount
);

export const selectRemainingConcepts = createSelector(
  [selectGame],
  game => game.remainingConcepts
);

export const selectHasStartedCounting = createSelector(
  [selectGame],
  game => game.hasStartedCounting
);

export const selectProgressCount = createSelector(
  [selectGame],
  game => game.progressCount
);

export const selectStarColorIndex = createSelector(
  [selectGame],
  game => game.starColorIndex
);

export const selectIsGameLoading = createSelector(
  [selectGame],
  game => game.isLoading
);

export const selectLevelProgress = createSelector(
  [selectGame],
  game => game.levelProgress
);

export const selectCategory = createSelector(
  [selectGame],
  game => game.category
);

export const selectCategories = createSelector(
  [selectGame],
  game => game.categories
);

export const selectCategoryProgress = createSelector(
  [selectGame],
  game => game.categoryProgress
);

// Selector combinado para todos los datos del juego necesarios
export const selectGameData = createSelector(
  [selectCategory, selectCurrentGroup, selectShowGroupSummary, selectCorrectCount, 
   selectRemainingConcepts, selectHasStartedCounting, selectProgressCount, 
   selectStarColorIndex, selectIsGameLoading, selectCategoryProgress],
  (category, currentGroup, showGroupSummary, correctCount, remainingConcepts, 
   hasStartedCounting, progressCount, starColorIndex, isLoading, categoryProgress) => ({
    category,
    currentGroup,
    showGroupSummary,
    correctCount,
    remainingConcepts,
    hasStartedCounting,
    progressCount,
    starColorIndex,
    isLoading,
    categoryProgress
  })
);