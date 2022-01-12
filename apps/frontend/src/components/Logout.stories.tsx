import { ComponentStory, ComponentMeta } from "@storybook/react"

import { LogoutButton } from "./Logout"

export default {
  title: "Logout",
  component: LogoutButton,
  argTypes: { onClick: { action: "click" } },
  decorators: [(Story) => <Story />],
} as ComponentMeta<typeof LogoutButton>

const Template: ComponentStory<typeof LogoutButton> = (args) => (
  <LogoutButton {...args} />
)

export const Simple = Template.bind({})
Simple.args = {}
