import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';

import { Card } from '../../common/components/Card';

export default {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    title: { type: { name: 'string' } },
    subtitle: { type: { name: 'string' } },
    image: {
      table: {
        disable: true,
      },
    },
    onClick: {
      defaultValue: undefined,
      table: {
        disable: true,
      },
    },
  },
  parameters: { controls: { exclude: ['onClick'] } },
} as ComponentMeta<typeof Card>;

const CardTemplate: ComponentStory<typeof Card> = (args) => {
  return <Card {...args} />;
};

export const Default = CardTemplate.bind({});
Default.args = {
  title: 'Some card title goes here',
  subtitle: 'Imagine this is a very interesting subtitle',
  image: <img src="https://picsum.photos/200/200" alt="img_desc" />,
};

export const MinimalCard = CardTemplate.bind({});
MinimalCard.args = {
  title: 'Some card title goes here',
};

export const SubtitleCard = CardTemplate.bind({});
SubtitleCard.args = {
  title: 'Some card title goes here',
  subtitle: 'Imagine this is a very interesting subtitle',
};

export const ImageCard = CardTemplate.bind({});
ImageCard.args = {
  title: 'Some card title goes here',
  image: <img src="https://picsum.photos/200/200" alt="img_desc" />,
};

export const BlankImageCard = CardTemplate.bind({});
BlankImageCard.args = {
  title: 'Some card title goes here',
  image: <></>,
};

export const ImageSubtitleCard = CardTemplate.bind({});
ImageSubtitleCard.args = {
  title: 'Some card title goes here',
  subtitle: 'Imagine this is a very interesting subtitle',
  image: <img src="https://picsum.photos/200/200" alt="img_desc" />,
};

export const LinkCard = CardTemplate.bind({});
LinkCard.args = {
  ...ImageSubtitleCard.args,
  linkTo: './some/internal/link',
};

export const ButtonCard = CardTemplate.bind({});
ButtonCard.args = {
  ...ImageSubtitleCard.args,
  onClick: () => alert('You clicked the button!'),
};

export const SelectableCard = () => {
  const [selected, setSelected] = useState(true);
  return (
    <Card
      title="Foo"
      subtitle="Imagine this is a very interesting subtitle"
      image={<img src="https://picsum.photos/128" alt="img_desc" />}
      onClick={() => setSelected(!selected)}
      selected={selected}
    />
  );
};

export const CardInContainer = () => {
  return (
    <div style={{ width: '100px' }}>
      <Card
        title="Foo"
        subtitle="Imagine this is a very interesting subtitle but its a bit long so it wraps"
        image={<img src="https://picsum.photos/128" alt="img_desc" />}
      />
    </div>
  );
};
