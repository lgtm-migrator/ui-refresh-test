import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { authFromToken, revokeToken } from '../../common/api/authService';

interface TokenInfo {
  created: number;
  expires: number;
  id: string;
  name: string | null;
  type: string;
  user: string;
  cachefor: number;
}

interface AuthState {
  token?: string;
  username?: string;
  tokenInfo?: TokenInfo;
}

const initialState: AuthState = {};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addMatcher(authFromToken.matchFulfilled, (state, { payload, meta }) => {
        state.token = meta.arg.originalArgs;
        state.username = payload.user;
        state.tokenInfo = payload;
      })
      .addMatcher(revokeToken.matchFulfilled, (state) => {
        state.token = undefined;
        state.username = undefined;
        state.tokenInfo = undefined;
      }),
});

export default authSlice.reducer;

export const authUsername = (state: RootState) => {
  if (!state.auth) return null;
  return state.auth.username;
};
