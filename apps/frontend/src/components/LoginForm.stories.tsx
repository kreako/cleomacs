import { ComponentStory, ComponentMeta } from "@storybook/react"
import { HashRouter } from "react-router-dom"
import { AuthenticationError } from "../api/utils"

import LoginForm from "./LoginForm"

export default {
  title: "LoginForm",
  component: LoginForm,
  argTypes: {
    onSubmit: { action: "submit" },
  },
  decorators: [
    (Story) => (
      <HashRouter>
        <div className="relative w-screen h-screen bg-indigo-50 p-2">
          <Story />
        </div>
      </HashRouter>
    ),
  ],
} as ComponentMeta<typeof LoginForm>

const Template: ComponentStory<typeof LoginForm> = (args) => (
  <LoginForm {...args} />
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

export const WithAuthenticationError = Template.bind({})
WithAuthenticationError.args = {
  loading: false,
  mainError: new AuthenticationError("Un grave problème"),
}
