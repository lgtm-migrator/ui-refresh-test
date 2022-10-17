import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { RootState } from '../../app/store';
import { authFromToken, revokeToken } from '../../common/api/authService';
import { clearCookie, setCookie } from '../../common/cookie';
import { useAppDispatch, useAppSelector } from '../../common/hooks';

export interface TokenInfo {
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
    setAuth: (
      state,
      {
        payload,
      }: PayloadAction<{
        token: string;
        username: string;
        tokenInfo: TokenInfo;
      } | null>
    ) => {
      const normToken = normalizeToken(payload?.token);
      state.token = normToken;
      state.username = payload?.username;
      state.tokenInfo = payload?.tokenInfo;
      if (payload != null) setAuthCookie(normToken, payload.tokenInfo);
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

const setAuthCookie = (token: string | undefined, tokenInfo: TokenInfo) => {
  if (token) {
    setCookie('kbase_session', token, {
      expires: new Date(tokenInfo.expires),
      domain: process.env.REACT_APP_KBASE_DOMAIN,
    });
  } else {
    clearCookie('kbase_session');
  }
};

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

  useEffect(() => {
    if (tokenQuery.isSuccess && normToken !== currentToken) {
      dispatch(
        setAuth({
          token: normToken,
          username: tokenQuery.data.user,
          tokenInfo: tokenQuery.data,
        })
      );
    }
  }, [
    currentToken,
    dispatch,
    normToken,
    tokenQuery.data,
    tokenQuery.isSuccess,
  ]);

  return tokenQuery;
};

const normalizeToken = <T = undefined>(
  t: string | undefined,
  fallback?: T
): string | T => {
  return t?.toUpperCase().trim() || (fallback as T);
};
