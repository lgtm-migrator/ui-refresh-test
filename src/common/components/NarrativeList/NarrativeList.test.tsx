import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NarrativeList from './NarrativeList';

const testItems = [{
    access_group: 12345,
    creator: 'charlie',
    narrative_title: "Charlie's Storybook Narrative",
    obj_id: 1,
    timestamp: 0,
    version: 8,
  },
  {
    access_group: 12346,
    creator: 'DJKhaled',
    narrative_title: 'Another One',
    obj_id: 1,
    timestamp: 0,
    version: 1,
  },
  {
    access_group: 12345,
    creator: 'charlie',
    narrative_title: "Charlie's Storybook Narrative",
    obj_id: 1,
    timestamp: 0,
    version: 8,
  },
  {
    access_group: 12346,
    creator: 'DJKhaled',
    narrative_title: 'Another One',
    obj_id: 1,
    timestamp: 0,
    version: 1,
  },
  {
    access_group: 12345,
    creator: 'charlie',
    narrative_title: "Charlie's Storybook Narrative",
    obj_id: 1,
    timestamp: 0,
    version: 8,
  },
];

test('NarrativeList renders', async () => {
  const { container } = render(
    <NarrativeList
      items={testItems}
      showVersionDropdown={true}
      itemsRemaining={0}
      hasMoreItems={false}
      loading={false}
    ></NarrativeList>
  );
  expect(container).toBeTruthy();
  expect(container.querySelectorAll('.narrative_item_outer')).toHaveLength(5);
  expect(screen.getByText('No more results.')).toBeInTheDocument();
});

test('NarrativeList displays loading circle', async () => {
  const { container } = render(
    <NarrativeList
      items={[]}
      showVersionDropdown={true}
      itemsRemaining={0}
      hasMoreItems={false}
      loading={true}
    ></NarrativeList>
  );
  expect(container.querySelectorAll('.narrative_item_outer')).toHaveLength(0);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('NarrativeList can load more items', async () => {
  const onLoadMoreItemsSpy = jest.fn();
  const { container } = render(
    <NarrativeList
      items={testItems}
      showVersionDropdown={true}
      itemsRemaining={42}
      hasMoreItems={true}
      loading={false}
      onLoadMoreItems={onLoadMoreItemsSpy}
    ></NarrativeList>
  );
  expect(container.querySelector('.list_footer')).toBeInTheDocument();
  const button = screen.getByText('Load more (42 remaining)');
  expect(button).toBeInTheDocument();
  button.click();
  expect(onLoadMoreItemsSpy).toHaveBeenCalledTimes(1);
});
