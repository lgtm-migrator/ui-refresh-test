import NarrativeViewItem from './NarrativeViewItem';
import { screen, render } from '@testing-library/react';
import { NarrativeListDoc } from './NarrativeDoc';

const testDoc: NarrativeListDoc = {
  timestamp: 8032329432,
  access_group: 4000,
  obj_id: 4000,
  version: 4000,
  narrative_title: 'What a cool narrative',
  creator: 'JaRule',
};

test('NarrativeViewItem renders', () => {
  const { container } = render(
    <NarrativeViewItem
      item={testDoc}
      idx={0}
      active={true}
      showVersionDropdown={true}
    />
  );
  expect(container).toBeTruthy();
  expect(container.querySelectorAll('.narrative_item_outer')).toHaveLength(1);
  expect(container.querySelector('.narrative_item_outer')).toHaveClass(
    'active'
  );
  expect(screen.getByText('What a cool narrative')).toBeInTheDocument();
  expect(
    screen.getByText('Updated 52 years ago by JaRule')
  ).toBeInTheDocument();
  expect(screen.getByText('v4000')).toBeInTheDocument();
});

test('NarrativeViewItem displays active class', () => {
  const { container } = render(
    <NarrativeViewItem
      item={testDoc}
      idx={0}
      active={true}
      showVersionDropdown={true}
    />
  );
  expect(container.querySelector('.narrative_item_outer')).toHaveClass(
    'active'
  );
});
