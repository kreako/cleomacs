import { ComponentStory, ComponentMeta } from "@storybook/react"

import { NameForm } from "./SettingsAccount"

export default {
  title: "settings/Account",
  component: NameForm,
  argTypes: {
    onSubmit: { action: "submit" },
  },
  decorators: [
    (Story) => (
      <div className="relative w-screen h-screen bg-sky-50">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof NameForm>

const Template: ComponentStory<typeof NameForm> = (args) => (
  <NameForm {...args} />
)

export const Simple = Template.bind({})
Simple.args = {
  loading: false,
  initialName: "Babou",
}

export const Loading = Template.bind({})
Loading.args = {
  ...Simple.args,
  loading: true,
}

export const Undefined = Template.bind({})
Undefined.args = {
  ...Simple.args,
  initialName: undefined,
}
