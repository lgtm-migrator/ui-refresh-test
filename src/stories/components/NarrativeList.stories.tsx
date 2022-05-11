import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import NarrativeList from '../../common/components/NarrativeList/NarrativeList';
export default {
  title: 'Components/NarrativeList',
  component: NarrativeList,
} as ComponentMeta<typeof NarrativeList>;

// Using a template allows the component to be rendered with dynamic storybook
// controls (args) these can be used to dynamically change the props of the
// component e.g. `<Component {...args} />`
const NarrativeListTemplate: ComponentStory<typeof NarrativeList> = (args) => {
  return (
    <Router>
      <div style={{ height: '70px', width: '100%', position: 'relative' }}>
        <NarrativeList {...args}></NarrativeList>
      </div>
    </Router>
  );
};

export const Default = NarrativeListTemplate.bind({});
Default.args = {
  showVersionDropdown: true,
  itemsRemaining: 16,
  hasMoreItems: false,
  items: [
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
    {
      access_group: 12346,
      creator: 'DJKhaled',
      narrative_title: 'Another One',
      obj_id: 1,
      timestamp: 0,
      version: 1,
    },
  ],
};
