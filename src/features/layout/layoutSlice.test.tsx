import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createTestStore } from '../../app/store';
import { initialState, usePageTitle } from './layoutSlice';

describe('usePageTitle', () => {
  beforeEach(() => {
    document.title = 'Some KBase Title';
  });

  test('usePageTitle sets string title', async () => {
    const store = createTestStore();
    const Component = () => {
      usePageTitle('some title');
      return <></>;
    };
    expect(store.getState().layout.pageTitle).toBe(initialState.pageTitle);
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );
    await waitFor(() => {
      expect(store.getState().layout.pageTitle).toBe('some title');
      expect(document.title).toBe(`${initialState.pageTitle}: some title`);
    });
  });

  test('usePageTitle sets empty string title', async () => {
    const store = createTestStore();
    const Component = () => {
      usePageTitle('');
      return <></>;
    };
    expect(store.getState().layout.pageTitle).toBe(initialState.pageTitle);
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );
    await waitFor(() => {
      expect(store.getState().layout.pageTitle).toBe('');
      expect(document.title).toBe(initialState.pageTitle);
    });
  });

  test('usePageTitle sets initial string title', async () => {
    const store = createTestStore();
    const Component = () => {
      usePageTitle(initialState.pageTitle);
      return <></>;
    };
    expect(store.getState().layout.pageTitle).toBe(initialState.pageTitle);
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );
    await waitFor(() => {
      expect(store.getState().layout.pageTitle).toBe(initialState.pageTitle);
      expect(document.title).toBe(initialState.pageTitle);
    });
  });
});
