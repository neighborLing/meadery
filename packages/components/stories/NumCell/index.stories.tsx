import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { NumCell } from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Data/NumCell',
  component: NumCell,
} as ComponentMeta<typeof NumCell>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NumCell> = (args) => <NumCell {...args} />;

export const Default = Template.bind({});

Default.args = {
  title: '总计待还金额',
  text: '60,249',
};