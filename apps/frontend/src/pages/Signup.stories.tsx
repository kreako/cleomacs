import { ComponentStory, ComponentMeta } from "@storybook/react"

import Signup from "./Signup"

export default {
  title: "Signup",
  component: Signup,
  argTypes: {},
  decorators: [(Story) => <Story />],
} as ComponentMeta<typeof Signup>

const Template: ComponentStory<typeof Signup> = () => <Signup />

export const Page = Template.bind({})
