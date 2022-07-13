import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import { EnhancedStore } from '@reduxjs/toolkit';
import { createTestStore } from '../../app/store';
import { WorkspaceObject } from '../../common/types/WorkspaceObject';
import { narrativePreview, NavigatorState, UPA } from './navigatorSlice';
import { KBaseJsonRpcError } from '@kbase/narrative-utils';

enableFetchMocks();

const testStore = createTestStore();

function makeFakeWorkspaceObject(id: string): WorkspaceObject {
  return {
    cells: [
      {
        source: id,
        cell_type: 'app',
      },
    ],
  };
}

const pendingWorkspace = (store: EnhancedStore, upa: UPA) => {
  const workspacePending = (resolve: (value: unknown) => void) => {
    const navigator = store.getState().navigator as NavigatorState;
    if (navigator.narrativeCache[upa].loading) {
      setTimeout(() => workspacePending(resolve), 10);
    } else {
      resolve(true);
    }
  };
  return workspacePending;
};

function waitForPending(store: EnhancedStore, upa: UPA) {
  return new Promise((resolve) => pendingWorkspace(store, upa)(resolve));
}

describe('navigatorSlice async thunk load cached ws Objects', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('navigatorSlice caches workspace objects', async () => {
    fetchMock.mockResponse(
      JSON.stringify({
        version: '1.1',
        result: [
          {
            data: [{ data: makeFakeWorkspaceObject('1/1/1') }],
          },
        ],
      })
    );
    testStore.dispatch(narrativePreview('1/1/1'));
    await waitForPending(testStore, '1/1/1');
    expect(testStore.getState().navigator.narrativeCache['1/1/1'].data).toEqual(
      makeFakeWorkspaceObject('1/1/1')
    );
  });

  test('navigator slice throws error', async () => {
    fetchMock.mockReject(
      new KBaseJsonRpcError({ code: 500, message: 'this is really bad' })
    );
    testStore.dispatch(narrativePreview('0/0/0'));
    await waitForPending(testStore, '0/0/0');
    expect(testStore.getState().navigator.narrativeCache['0/0/0'].error).toBe(
      'this is really bad'
    );
  });

  test('navigator slice gives pending status', () => {
    testStore.dispatch(narrativePreview('2/2/2'));
    expect(
      testStore.getState().navigator.narrativeCache['2/2/2'].loading
    ).toBeTruthy();
  });

  test('cache maintains multiple items at once', () => {
    const cache = testStore.getState().navigator.narrativeCache;
    expect(cache).toHaveProperty('0/0/0');
    expect(cache).toHaveProperty('1/1/1');
    expect(cache).toHaveProperty('2/2/2');
  });
});
