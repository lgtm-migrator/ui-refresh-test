import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Nav from '../common/Nav';

export default {
  title: 'Nav',
  component: Nav,
} as ComponentMeta<typeof Nav>;

export const Default: ComponentStory<typeof Nav> = () => (
  <Router>
    <Nav />
  </Router>
);
