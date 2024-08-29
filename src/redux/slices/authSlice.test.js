import { configureStore } from '@reduxjs/toolkit';
import authReducer, { initializeAuth, signOutUser } from './authSlice';

// Mocks para los servicios externos
jest.mock('../../services/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    signInAnonymously: jest.fn(),
    signOut: jest.fn()
  }
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: initialState }
  });
};

describe('authSlice', () => {
  describe('async actions', () => {
    it('sets isAuthLoading to false when initializeAuth is done', async () => {
      const store = createMockStore();

      // Mock Firebase onAuthStateChanged to simulate an existing user
      require('../../services/firebase').auth.onAuthStateChanged.mockImplementation((callback) => {
        callback({ uid: '123', isAnonymous: false });
        return jest.fn(); // Return a mock unsubscribe function
      });

      await store.dispatch(initializeAuth());

      const state = store.getState().auth;
      expect(state.isAuthLoading).toBe(false);
    });

    it('sets isAuthLoading to false after signOutUser is done', async () => {
      const initialState = {
        user: { uid: '123' },
        isAnonymous: false,
        isAuthLoading: false
      };
      const store = createMockStore(initialState);

      // Mock Firebase signOut to simulate a successful sign out
      require('../../services/firebase').auth.signOut.mockResolvedValue();

      await store.dispatch(signOutUser());

      const state = store.getState().auth;
      expect(state.isAuthLoading).toBe(false);
    });
  });
});
