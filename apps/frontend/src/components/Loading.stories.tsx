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

const Template: ComponentStory<typeof Loading> = () => <Loading />

export const Simple = Template.bind({})
Simple.args = {}
