import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { authFromToken, revokeToken } from '../../common/api/authService';
import { useAppDispatch, useAppSelector } from '../../common/hooks';

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
  reducers: {
    setAuth: (state, { payload }: PayloadAction<AuthState>) => {
      state.token = normalizeToken(payload.token);
      state.username = payload.username;
      state.tokenInfo = payload.tokenInfo;
    },
  },
  extraReducers: (builder) =>
    builder.addMatcher(revokeToken.matchFulfilled, (state, action) => {
      // Clear current token if it's been revoked when revokeToken succeeds
      const revokedTokenId = action.meta.arg.originalArgs;
      if (revokedTokenId === state.tokenInfo?.id) {
        state.token = undefined;
        state.username = undefined;
        state.tokenInfo = undefined;
      }
    }),
});

export default authSlice.reducer;
export const { setAuth } = authSlice.actions;

export const authUsername = (state: RootState) => {
  return state.auth.username;
};

export const authToken = (state: RootState) => {
  return state.auth.token;
};

export const useTryAuthFromToken = (token?: string) => {
  const dispatch = useAppDispatch();
  const currentToken = useAppSelector(authToken);
  const normToken = normalizeToken(token, '');

  const tokenQuery = authFromToken.useQuery(normToken, {
    skip: !normToken,
  });

  if (tokenQuery.isSuccess && normToken !== currentToken) {
    dispatch(
      setAuth({
        token: normToken,
        username: tokenQuery.data.user,
        tokenInfo: tokenQuery.data,
      })
    );
  }

  return tokenQuery;
};

const normalizeToken = <T = undefined>(
  t?: string,
  fallback: T = undefined as T
): string | T => {
  return t?.toUpperCase().trim() || fallback;
};
