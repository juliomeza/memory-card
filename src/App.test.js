import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

// Mocks para los slices
const mockInitializeAuth = jest.fn().mockReturnValue({ type: 'auth/initializeAuth' });
const mockInitializeGame = jest.fn().mockReturnValue({ type: 'game/initializeGame' });

jest.mock('../src/redux/slices/authSlice', () => ({
  initializeAuth: mockInitializeAuth,
}));

jest.mock('../src/redux/slices/gameSlice', () => ({
  initializeGame: mockInitializeGame,
}));

// Mock para GoogleOAuthProvider
jest.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => <>{children}</>,
}));

// Mock reducers
const mockAuthReducer = (state = { user: null, isAnonymous: true, isAuthLoading: false, authError: null }, action) => state;
const mockGameReducer = (state = { level: 1000, concepts: [], currentGroup: [], remainingConcepts: [], groupIndex: 0, showGroupSummary: false, correctCount: 0, progressCount: 0, hasStartedCounting: false, starColorIndex: 0, isLoading: false, error: null, levelProgress: { completed: 0, total: 0 } }, action) => state;

describe('App component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: mockAuthReducer,
        game: mockGameReducer
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        thunk: {
          extraArgument: {
            initializeAuth: mockInitializeAuth,
            initializeGame: mockInitializeGame
          }
        }
      })
    });
  });

  test('renders main app element', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Verifica que se haya llamado a initializeAuth
    expect(mockInitializeAuth).toHaveBeenCalled();

    // Verifica que exista un elemento con el rol "main" en el documento
    // Si tu App no tiene un elemento con role="main", ajusta esto según tu estructura
    const appElement = screen.getByRole('main', { name: '' });
    expect(appElement).toBeInTheDocument();
  });
});