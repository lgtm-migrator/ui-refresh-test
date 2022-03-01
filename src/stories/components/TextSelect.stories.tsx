import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';

import {
  TextSelect,
  TextSelectOption,
} from '../../common/components/TextSelect';

export default {
  title: 'Components/TextSelect',
  component: TextSelect,
} as ComponentMeta<typeof TextSelect>;

const TextSelectTemplate: ComponentStory<typeof TextSelect> = (args) => {
  const [value, setValue] = useState<TextSelectOption | undefined>();
  const handleChange = (value: TextSelectOption | undefined) => {
    setValue(value);
  };
  const options: TextSelectOption[] = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];
  return (
    <TextSelect
      {...args}
      value={value}
      options={options}
      onChange={handleChange}
    />
  );
};

export const Default = TextSelectTemplate.bind({});
Default.args = {
  isDisabled: false,
  isClearable: true,
};
