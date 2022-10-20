// Start a new test file for profileSlice specifically.
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import fetchMock from 'jest-fetch-mock';

import { createTestStore } from '../../app/store';
import { authFromToken, revokeToken } from '../../common/api/authService';
import { TokenInfo, useSetTokenCookie, useTryAuthFromToken } from './authSlice';
import * as cookies from '../../common/cookie';

let testStore = createTestStore({});
describe('authSlice', () => {
  beforeEach(() => {
    testStore = createTestStore({});
  });

  test('useTryAuthFromToken sets auth token and username', async () => {
    const mock = jest.spyOn(authFromToken, 'useQuery');
    mock.mockImplementation(() => {
      return {
        isSuccess: true,
        data: { user: 'someUser' },
      } as unknown as ReturnType<typeof authFromToken['useQuery']>; // Assert mocked response type
    });
    const Component = () => {
      useTryAuthFromToken('some token');
      return <></>;
    };
    render(
      <Provider store={testStore}>
        <Component />
      </Provider>
    );
    await waitFor(() => {
      // token gets normalized to uppercase
      expect(testStore.getState().auth.token).toBe('SOME TOKEN');
      expect(testStore.getState().auth.username).toBe('someUser');
    });
    mock.mockClear();
  });

  test('useTryAuthFromToken fails quietly with invalid token', async () => {
    const mock = jest.spyOn(authFromToken, 'useQuery');
    mock.mockImplementation(() => {
      return {
        isSuccess: false,
        isError: true,
      } as unknown as ReturnType<typeof authFromToken['useQuery']>; // Assert mocked response type
    });
    const Component = () => {
      useTryAuthFromToken('some token');
      return <></>;
    };
    render(
      <Provider store={testStore}>
        <Component />
      </Provider>
    );
    await waitFor(() => {
      expect(testStore.getState().auth.token).toBe(undefined);
      expect(testStore.getState().auth.username).toBe(undefined);
    });
    mock.mockClear();
  });

  test('Auth token gets removed from state if revoked', async () => {
    const testStore = createTestStore({
      auth: {
        username: 'someUser',
        token: 'foo',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tokenInfo: { id: 'existing-tokenid' } as TokenInfo,
      },
    });
    fetchMock.enableMocks();
    fetchMock.mockOnce(''); // force the next call to succeed
    await testStore.dispatch(revokeToken.initiate('existing-tokenid'));
    await waitFor(() => {
      expect(testStore.getState().auth.token).toBe(undefined);
      expect(testStore.getState().auth.username).toBe(undefined);
    });
    fetchMock.disableMocks();
  });

  test('Auth token remains if other token revoked', async () => {
    const testStore = createTestStore({
      auth: {
        username: 'someUser',
        token: 'foo',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tokenInfo: { id: 'existing-tokenid' } as TokenInfo,
      },
    });
    fetchMock.enableMocks();
    fetchMock.mockOnce(''); // force the next call to succeed
    await testStore.dispatch(revokeToken.initiate('other-tokenid'));
    await waitFor(() => {
      expect(testStore.getState().auth.token).toBe('foo');
      expect(testStore.getState().auth.username).toBe('someUser');
    });
    fetchMock.disableMocks();
  });

  describe('useSetTokenCookie', () => {
    let setCookieMock: jest.SpyInstance<
      ReturnType<typeof cookies.setCookie>,
      Parameters<typeof cookies.setCookie>
    >;
    let clearCookieMock: jest.SpyInstance<
      ReturnType<typeof cookies.clearCookie>,
      Parameters<typeof cookies.clearCookie>
    >;
    let consoleErrorMock: jest.SpyInstance<
      ReturnType<typeof console.error>,
      Parameters<typeof console.error>
    >;
    beforeAll(() => {
      setCookieMock = jest.spyOn(cookies, 'setCookie');
      setCookieMock.mockImplementation(() => undefined);
      clearCookieMock = jest.spyOn(cookies, 'clearCookie');
      clearCookieMock.mockImplementation(() => undefined);
      consoleErrorMock = jest.spyOn(console, 'error');
      consoleErrorMock.mockImplementation(() => undefined);
    });
    beforeEach(() => {
      setCookieMock.mockClear();
      clearCookieMock.mockClear();
      consoleErrorMock.mockClear();
    });
    afterAll(() => {
      setCookieMock.mockRestore();
      clearCookieMock.mockRestore();
      consoleErrorMock.mockRestore();
    });

    test('useSetTokenCookie clears cookie if auth token is undefined', async () => {
      const Component = () => {
        useSetTokenCookie();
        return <></>;
      };
      render(
        <Provider store={testStore}>
          <Component />
        </Provider>
      );
      await waitFor(() => {
        expect(clearCookieMock).toHaveBeenCalledWith('kbase_session');
        expect(consoleErrorMock).not.toHaveBeenCalled();
      });
    });

    test('useSetTokenCookie sets cookie if auth token exists with expiration', async () => {
      const auth = {
        token: 'some-token',
        username: 'some-user',
        tokenInfo: {
          expires: Date.now() + Math.floor(Math.random() * 10000),
        } as TokenInfo,
      };
      const Component = () => {
        useSetTokenCookie();
        return <></>;
      };
      render(
        <Provider store={createTestStore({ auth })}>
          <Component />
        </Provider>
      );
      await waitFor(() => {
        expect(setCookieMock).toHaveBeenCalledWith(
          'kbase_session',
          'some-token',
          {
            domain: 'ci-europa.kbase.us',
            expires: new Date(auth.tokenInfo.expires),
          }
        );
        expect(consoleErrorMock).not.toHaveBeenCalled();
      });
    });

    test('useSetTokenCookie sets cookie without domain in development mode', async () => {
      const processEnv = process.env;
      process.env = { ...processEnv, NODE_ENV: 'development' };
      const auth = {
        token: 'some-token',
        username: 'some-user',
        tokenInfo: {
          expires: Date.now() + 1,
        } as TokenInfo,
      };
      const Component = () => {
        useSetTokenCookie();
        return <></>;
      };
      render(
        <Provider store={createTestStore({ auth })}>
          <Component />
        </Provider>
      );
      await waitFor(() => {
        expect(setCookieMock).toHaveBeenCalledWith(
          'kbase_session',
          'some-token',
          {
            expires: new Date(auth.tokenInfo.expires),
          }
        );
        expect(consoleErrorMock).not.toHaveBeenCalled();
      });
      process.env = processEnv;
    });

    test('useSetTokenCookie does nothing and `console.error`s if token is defined but tokenInfo.expires is not', async () => {
      const auth = {
        token: 'some-token',
        username: 'some-user',
        tokenInfo: undefined,
      };
      const Component = () => {
        useSetTokenCookie();
        return <></>;
      };
      render(
        <Provider store={createTestStore({ auth })}>
          <Component />
        </Provider>
      );
      await waitFor(() => {
        expect(consoleErrorMock).toHaveBeenCalledWith(
          'Could not set token cookie, missing expire time'
        );
        expect(setCookieMock).not.toHaveBeenCalled();
      });
    });
  });
});
