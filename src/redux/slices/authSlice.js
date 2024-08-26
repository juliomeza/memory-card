import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../services/firebase';
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { initializeUserProgress } from '../../services/userProgressManager';

const serializeUser = (user) => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
  };
};

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          await initializeUserProgress(currentUser.uid);
          dispatch(setUser(serializeUser(currentUser)));
        } else {
          const anonymousUser = await signInAnonymously(auth);
          await initializeUserProgress(anonymousUser.user.uid);
          dispatch(setUser(serializeUser(anonymousUser.user)));
        }
        resolve();
      });
    });
  }
);

export const signOutUser = createAsyncThunk(
  'auth/signOut',
  async () => {
    await signOut(auth);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAnonymous: true,
    isAuthLoading: true,
    authError: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAnonymous = action.payload ? action.payload.isAnonymous : true;
      state.isAuthLoading = false;
    },
    setAuthError: (state, action) => {
      state.authError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isAuthLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state) => {
        state.isAuthLoading = false;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isAuthLoading = false;
        state.authError = action.error.message;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.isAnonymous = true;
      });
  },
});

export const { setUser, setAuthError } = authSlice.actions;

export default authSlice.reducer;