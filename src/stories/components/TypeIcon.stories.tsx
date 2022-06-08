import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import TypeIcon from '../../common/components/TypeIcon';
import { typeIconInfos } from '../../common/slices/icons';

export default {
  title: 'Components/TypeIcon',
  component: TypeIcon,
  argTypes: {
    objType: {
      options: Object.keys(typeIconInfos),
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof TypeIcon>;

// Using a template allows the component to be rendered with dynamic storybook
// controls (args) these can be used to dynamically change the props of the
// component e.g. `<Component {...args} />`
const TypeIconTemplate: ComponentStory<typeof TypeIcon> = (args) => {
  return (
    <Router>
      <div style={{ height: '70px', width: '100%', position: 'relative' }}>
        <TypeIcon {...args}></TypeIcon>
      </div>
    </Router>
  );
};

export const Default = TypeIconTemplate.bind({});

Default.args = {
  objType: 'AssemblyInput',
};
