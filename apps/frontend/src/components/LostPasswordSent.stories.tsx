import { ComponentStory, ComponentMeta } from "@storybook/react"

import LostPasswordSent from "./LostPasswordSent"

export default {
  title: "auth/LostPasswordSent",
  component: LostPasswordSent,
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="relative w-screen h-screen bg-sky-50 p-2">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof LostPasswordSent>

const Template: ComponentStory<typeof LostPasswordSent> = () => (
  <LostPasswordSent />
)

export const Simple = Template.bind({})
Simple.args = {}
