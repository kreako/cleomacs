import { ComponentStory, ComponentMeta } from "@storybook/react"
import { HashRouter } from "react-router-dom"
import { InvalidTokenError } from "../api/auth-password"

import ChangeLostPasswordForm from "./ChangeLostPasswordForm"

export default {
  title: "auth/ChangeLostPasswordForm",
  component: ChangeLostPasswordForm,
  argTypes: {
    onSubmit: { action: "submit" },
  },
  decorators: [
    (Story) => (
      <HashRouter>
        <div className="relative w-screen h-screen bg-sky-50 p-2 flex flex-col items-center">
          <Story />
        </div>
      </HashRouter>
    ),
  ],
} as ComponentMeta<typeof ChangeLostPasswordForm>

const Template: ComponentStory<typeof ChangeLostPasswordForm> = (args) => (
  <ChangeLostPasswordForm {...args} />
)

export const Simple = Template.bind({})
Simple.args = {
  userName: "Jean-Michel de La Jarre",
  userEmail: "jean-mimija@gmail.com",
  loading: false,
  mainError: undefined,
}

export const NoName = Template.bind({})
NoName.args = {
  ...Simple.args,
  userName: null,
}

export const Loading = Template.bind({})
Loading.args = {
  ...Simple.args,
  loading: true,
}

export const WithError = Template.bind({})
WithError.args = {
  ...Simple.args,
  mainError: new Error("Un grave problème"),
}

export const WithInvalidTokenError = Template.bind({})
WithInvalidTokenError.args = {
  ...Simple.args,
  userName: null,
  userEmail: "",
  mainError: new InvalidTokenError(),
}
