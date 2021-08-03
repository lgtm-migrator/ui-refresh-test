import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

// Define a type for the slice state
interface CountState {
  count: number;
}

// Define the initial state using that type
const initialState: CountState = {
  count: 0,
};

export const countSlice = createSlice({
  name: 'count',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
  },
});

export default countSlice.reducer;
export const { increment } = countSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const countStatus = (state: RootState) => state.count.count;
