import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

// Mocks para los slices
const mockInitializeAuth = jest.fn().mockReturnValue({ type: 'auth/initializeAuth' });
const mockInitializeGame = jest.fn().mockReturnValue({ type: 'game/initializeGame' });

jest.mock('./redux/slices/authSlice', () => ({
  initializeAuth: () => mockInitializeAuth,
}));

jest.mock('./redux/slices/gameSlice', () => ({
  initializeGame: () => mockInitializeGame,
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
    });
  });

  test('renders App component with header and main content', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Verifica que se haya llamado a initializeAuth
    expect(mockInitializeAuth).toHaveBeenCalled();

    // Verifica que exista un header
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();

    // Verifica que exista el botón de login
    const loginButton = screen.getByRole('button', { name: /log in/i });
    expect(loginButton).toBeInTheDocument();

    // Verifica que exista el selector de nivel
    const levelSelector = screen.getByRole('combobox', { name: /select level/i });
    expect(levelSelector).toBeInTheDocument();

    // Verifica que exista el contenido principal (puede ser un texto o un elemento específico)
    const mainContent = screen.getByText(/no concepts available for review at this time/i);
    expect(mainContent).toBeInTheDocument();
  });
});