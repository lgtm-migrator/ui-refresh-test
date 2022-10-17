// Start a new test file for profileSlice specifically.
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import fetchMock from 'jest-fetch-mock';

import { createTestStore } from '../../app/store';
import { authFromToken, revokeToken } from '../../common/api/authService';
import { useTryAuthFromToken } from './authSlice';

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
        tokenInfo: { id: 'existing-tokenid' } as any,
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
        tokenInfo: { id: 'existing-tokenid' } as any,
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
});
