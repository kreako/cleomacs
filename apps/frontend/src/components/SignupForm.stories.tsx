import { ComponentStory, ComponentMeta } from "@storybook/react"
import { HashRouter } from "react-router-dom"
import { DuplicatesError } from "../api/auth"

import SignupForm from "./SignupForm"

export default {
  title: "auth/SignupForm",
  component: SignupForm,
  argTypes: {
    onSubmit: { action: "submit" },
  },
  decorators: [
    (Story) => (
      <HashRouter>
        <div className="relative w-screen h-screen bg-sky-50 p-2">
          <Story />
        </div>
      </HashRouter>
    ),
  ],
} as ComponentMeta<typeof SignupForm>

const Template: ComponentStory<typeof SignupForm> = (args) => (
  <SignupForm {...args} />
)

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

export const WithDuplicatesOrganizationError = Template.bind({})
WithDuplicatesOrganizationError.args = {
  loading: false,
  mainError: new DuplicatesError(true, false),
}

export const WithDuplicatesOrganizationEmailError = Template.bind({})
WithDuplicatesOrganizationEmailError.args = {
  loading: false,
  mainError: new DuplicatesError(true, true),
}

export const WithDuplicatesEmailError = Template.bind({})
WithDuplicatesEmailError.args = {
  loading: false,
  mainError: new DuplicatesError(false, true),
}
