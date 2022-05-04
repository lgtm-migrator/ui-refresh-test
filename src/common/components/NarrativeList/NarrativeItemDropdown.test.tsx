import { screen, render } from '@testing-library/react';
import NarrativeItemDropdown from './NarrativeItemDropdown';

test('NarrativeItemDropdown renders', async () => {
  const versionSelectSpy = jest.fn();
  const { container } = render(
    <NarrativeItemDropdown version={400} onVersionSelect={versionSelectSpy} />
  );
  expect(container).toBeTruthy();
  expect(container.querySelector('.dropdown_wrapper')).toBeInTheDocument();
  expect(screen.getByText('v400')).toBeInTheDocument();
});
