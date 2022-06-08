import AppCellIcon from './AppCellIcon';
import { createTestStore } from '../../app/store';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { AppTag } from '../slices/iconSlice';

test('AppCellIcon renders initial loading icon', () => {
  const { container } = render(
    <Provider store={createTestStore()}>
      <AppCellIcon appId="SomeModule.someApp" appTag={AppTag.release} />
    </Provider>
  );
  expect(container.querySelector('svg[data-icon="spinner"]')).not.toBeNull();
});

test('AppCellIcon renders an icon after the callback finishes', async () => {
  const { container } = render(
    <Provider store={createTestStore()}>
      <AppCellIcon appId="SomeModule.someApp" appTag={AppTag.beta} />
    </Provider>
  );
  await waitFor(() => {
    expect(
      container.querySelector('svg[data-icon="spinner"]')
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('svg[data-icon="cube"]')
    ).toBeInTheDocument();
  });
});
