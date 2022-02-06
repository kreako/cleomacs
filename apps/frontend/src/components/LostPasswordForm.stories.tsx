import { ComponentStory, ComponentMeta } from "@storybook/react"
import { UnknownEmailError } from "../api/auth-password"

import LostPasswordForm from "./LostPasswordForm"

export default {
  title: "auth/LostPasswordForm",
  component: LostPasswordForm,
  argTypes: {
    onSubmit: { action: "submit" },
  },
  decorators: [
    (Story) => (
      <div className="relative h-screen w-screen bg-sky-50 p-2">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof LostPasswordForm>

const Template: ComponentStory<typeof LostPasswordForm> = (args) => <LostPasswordForm {...args} />

export const Simple = Template.bind({})
Simple.args = {
  loading: false,
  mainError: undefined,
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true,
  mainError: undefined,
}

export const WithError = Template.bind({})
WithError.args = {
  loading: false,
  mainError: new Error("Un grave problème"),
}

export const WithUnknownEmailError = Template.bind({})
WithUnknownEmailError.args = {
  loading: false,
  mainError: new UnknownEmailError("olivier@kreako.fr"),
}
