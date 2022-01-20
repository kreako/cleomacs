import { ComponentStory, ComponentMeta } from "@storybook/react"

import { LostPasswordSent } from "./LostPasswordSent"

export default {
  title: "LostPasswordSent",
  component: LostPasswordSent,
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="relative w-screen h-screen bg-indigo-50 p-2">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof LostPasswordSent>

const Template: ComponentStory<typeof LostPasswordSent> = (args) => (
  <LostPasswordSent />
)

export const Simple = Template.bind({})
Simple.args = {}
