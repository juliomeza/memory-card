import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  testValue: 'Redux is working!'
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {}
});

export default appSlice.reducer;