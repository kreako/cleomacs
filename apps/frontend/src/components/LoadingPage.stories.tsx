import { ComponentStory, ComponentMeta } from "@storybook/react"

import LoadingPage from "./LoadingPage"

export default {
  title: "generic/LoadingPage",
  component: LoadingPage,
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="relative w-screen h-screen bg-sky-50">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof LoadingPage>

const Template: ComponentStory<typeof LoadingPage> = () => <LoadingPage />

export const Simple = Template.bind({})
Simple.args = {}
