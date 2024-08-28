import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  setUser,
  setAuthError,
  initializeAuth,
  signOutUser
} from './authSlice';

// Mock Firebase and userProgressManager
jest.mock('../../services/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    signInAnonymously: jest.fn(),
    signOut: jest.fn()
  }
}));

jest.mock('../../services/userProgressManager', () => ({
  initializeUserProgress: jest.fn()
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: initialState }
  });
};

describe('authSlice', () => {
  describe('reducer, actions and selectors', () => {
    it('should return the initial state on first run', () => {
      const nextState = authReducer(undefined, {});
      expect(nextState).toEqual({
        user: null,
        isAnonymous: true,
        isAuthLoading: true,
        authError: null,
      });
    });

    it('should properly set the user', () => {
      const user = { uid: '123', email: 'test@example.com', isAnonymous: false };
      const nextState = authReducer(undefined, setUser(user));
      expect(nextState.user).toEqual(user);
      expect(nextState.isAnonymous).toBe(false);
    });

    it('should properly set the auth error', () => {
      const error = 'Authentication failed';
      const nextState = authReducer(undefined, setAuthError(error));
      expect(nextState.authError).toEqual(error);
    });
  });

  describe('async actions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('creates SET_USER when initializeAuth is done with existing user', async () => {
      const mockUser = { uid: '123', isAnonymous: false };
      const store = createMockStore();
      
      require('../../services/firebase').auth.onAuthStateChanged.mockImplementation((callback) => {
        callback(mockUser);
        return jest.fn(); // Return a mock unsubscribe function
      });

      await store.dispatch(initializeAuth());

      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.isAnonymous).toBe(false);
      expect(state.isAuthLoading).toBe(false);
    });

    it('creates SET_USER when initializeAuth is done with anonymous user', async () => {
      const mockAnonymousUser = { uid: 'anon123', isAnonymous: true };
      const store = createMockStore();
      
      require('../../services/firebase').auth.onAuthStateChanged.mockImplementation((callback) => {
        callback(null);
        return jest.fn(); // Return a mock unsubscribe function
      });

      require('../../services/firebase').auth.signInAnonymously.mockResolvedValue({ user: mockAnonymousUser });

      await store.dispatch(initializeAuth());

      const state = store.getState().auth;
      expect(state.user).toEqual(mockAnonymousUser);
      expect(state.isAnonymous).toBe(true);
      expect(state.isAuthLoading).toBe(false);
    });

    it('creates SET_USER with null when signOutUser is done', async () => {
      const initialState = {
        user: { uid: '123' },
        isAnonymous: false,
        isAuthLoading: false
      };
      const store = createMockStore(initialState);

      require('../../services/firebase').auth.signOut.mockResolvedValue();

      await store.dispatch(signOutUser());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAnonymous).toBe(true);
    });
  });
});