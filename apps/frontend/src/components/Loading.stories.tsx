import { ComponentStory, ComponentMeta } from "@storybook/react"

import Loading from "./Loading"

export default {
  title: "Loading",
  component: Loading,
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="relative w-screen h-screen bg-indigo-50">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Loading>

const Template: ComponentStory<typeof Loading> = (args) => <Loading {...args} />

export const Simple = Template.bind({})
Simple.args = {
  size: 2,
}

export const Big = Template.bind({})
Big.args = {
  size: 10,
}