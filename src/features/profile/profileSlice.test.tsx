// Start a new test file for profileSlice specifically.
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import { createTestStore } from '../../app/store';

import { useLoggedInProfileUser } from './profileSlice';

let testStore = createTestStore({});
describe('useLoggedInProfileUser', () => {
  beforeEach(() => {
    testStore = createTestStore({});
  });

  test('useLoggedInProfileUser sets loggedInProfile on success with valid username', async () => {
    const Component = () => {
      useLoggedInProfileUser('dlyon');
      return <></>;
    };
    render(
      <Provider store={testStore}>
        <Component />
      </Provider>
    );
    await waitFor(() =>
      expect(testStore.getState().profile.loggedInProfile?.user.username).toBe(
        'dlyon'
      )
    );
  });

  test('useLoggedInProfileUser throws error when called with invalid username', async () => {
    const mockUseLoggedInProfileUser = jest.fn(useLoggedInProfileUser);
    const Component = () => {
      mockUseLoggedInProfileUser('!!!Iamnotause');
      return <></>;
    };
    render(
      <Provider store={testStore}>
        <Component />
      </Provider>
    );
    await waitFor(() => expect(mockUseLoggedInProfileUser).toThrow());
    expect(testStore.getState().profile.loggedInProfile?.user.username).toBe(
      undefined
    );
  });
});
