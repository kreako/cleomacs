import { faker } from "."

test("A dummy test", () => {
  const f = faker()
  expect(f.organizationName).toBeDefined()
  expect(f.userName).toBeDefined()
  expect(f.email).toBeDefined()
  expect(f.password).toBeDefined()
})
