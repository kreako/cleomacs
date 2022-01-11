import { ComponentStory, ComponentMeta } from "@storybook/react"

import LabelInput from "./LabelInput"

export default {
  title: "LabelInput",
  component: LabelInput,
  argTypes: {
    onChange: { action: "change" },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof LabelInput>

const Template: ComponentStory<typeof LabelInput> = (args) => (
  <LabelInput {...args} />
)

export const Text = Template.bind({})
Text.args = {
  label: "Votre nom",
  name: "name",
  value: "",
  kind: "text",
}

export const TextWithError = Template.bind({})
TextWithError.args = {
  ...Text.args,
  error: "Quelque chose n'est pas très clair",
}

export const Email = Template.bind({})
Email.args = {
  ...Text.args,
  label: "Votre email",
  kind: "email",
}

export const EmailWithError = Template.bind({})
EmailWithError.args = {
  ...Email.args,
  error: "Quelque chose n'est pas très clair",
}

export const Password = Template.bind({})
Password.args = {
  ...Text.args,
  label: "Votre password",
  kind: "password",
}

export const PasswordWithError = Template.bind({})
PasswordWithError.args = {
  ...Password.args,
  error: "Quelque chose n'est pas très clair",
}
