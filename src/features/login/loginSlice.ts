import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

// Define a type for the slice state
interface LoginState {
  loggedIn: boolean;
  user?: string;
}

// Define the initial state using that type
const initialState: LoginState = {
  loggedIn: false,
  user: undefined,
};

export const loginSlice = createSlice({
  name: 'login',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.loggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.loggedIn = false;
      state.user = undefined;
    },
  },
});

export default loginSlice.reducer;
export const { login, logout } = loginSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const loginStatus = (state: RootState) => state.login.loggedIn;
