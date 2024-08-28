import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import authReducer, {
  setUser,
  setAuthError,
  initializeAuth,
  signOutUser
} from './authSlice';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

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
      const user = { uid: '123', email: 'test@example.com' };
      const nextState = authReducer(undefined, setUser(user));
      expect(nextState.user).toEqual(user);
      expect(nextState.isAnonymous).toBeFalsy();
    });

    it('should properly set the auth error', () => {
      const error = 'Test error';
      const nextState = authReducer(undefined, setAuthError(error));
      expect(nextState.authError).toEqual(error);
    });
  });

  describe('async actions', () => {
    it('creates SET_USER when initializeAuth is done', () => {
      const expectedActions = [
        { type: 'auth/initializeAuth/pending' },
        { type: 'auth/setUser', payload: { uid: '123', isAnonymous: false } },
        { type: 'auth/initializeAuth/fulfilled' }
      ];
      const store = mockStore({});

      // Mock the Firebase auth and Firestore functions
      jest.mock('firebase/auth', () => ({
        onAuthStateChanged: (auth, callback) => callback({ uid: '123', isAnonymous: false }),
      }));
      jest.mock('../../services/userProgressManager', () => ({
        initializeUserProgress: jest.fn(() => Promise.resolve()),
      }));

      return store.dispatch(initializeAuth()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('creates SET_USER with null when signOutUser is done', () => {
      const expectedActions = [
        { type: 'auth/signOutUser/pending' },
        { type: 'auth/setUser', payload: null },
        { type: 'auth/signOutUser/fulfilled' }
      ];
      const store = mockStore({});

      // Mock the Firebase auth function
      jest.mock('firebase/auth', () => ({
        signOut: jest.fn(() => Promise.resolve()),
      }));

      return store.dispatch(signOutUser()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});