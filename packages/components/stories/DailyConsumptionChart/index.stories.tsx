import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DailyConsumptionChart } from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Data/DailyConsumptionChart',
  component: DailyConsumptionChart,
} as ComponentMeta<typeof DailyConsumptionChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DailyConsumptionChart> = (args) => <DailyConsumptionChart {...args} />;

export const Default = Template.bind({});

Default.args = {
  title: '总计待还金额',
  text: '153,249',
};