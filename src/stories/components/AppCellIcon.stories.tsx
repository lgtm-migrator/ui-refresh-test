import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import AppCellIcon from '../../common/components/AppCellIcon';
import { AppTag } from '../../common/slices/iconSlice';

export default {
  title: 'Components/AppCellIcon',
  component: AppCellIcon,
} as ComponentMeta<typeof AppCellIcon>;

// Using a template allows the component to be rendered with dynamic storybook
// controls (args) these can be used to dynamically change the props of the
// component e.g. `<Component {...args} />`
const AppCellIconTemplate: ComponentStory<typeof AppCellIcon> = (args) => {
  return (
    <Router>
      <div style={{ height: '70px', width: '100%', position: 'relative' }}>
        <AppCellIcon {...args}></AppCellIcon>
      </div>
    </Router>
  );
};

export const Default = AppCellIconTemplate.bind({});

Default.args = {
  appTag: 'release' as AppTag,
  appId: 'Taxon',
};
