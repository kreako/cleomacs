import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { preview } from "vite"
import type { PreviewServer } from "vite"
import puppeteer from "puppeteer"
import type { Browser, Page } from "puppeteer"
import { cleanupOrganizationFromDb, faker } from "@cleomacs/test"

describe("signup", async () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    server = await preview({ preview: { port: 3100 } })
    browser = await puppeteer.launch({
      //headless: false,
      // slowMo: 10,
      //devtools: true,
    })
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
    await server.httpServer.close()
  })

  test("Successfull signup", async () => {
    const fake = faker()

    await page.goto("http://localhost:3100/#/signup", {
      waitUntil: "networkidle0",
    })

    const organizationName = await page.$("#organizationName")
    expect(organizationName).not.toBeNull()
    await organizationName?.type(fake.organizationName)

    const identityName = await page.$("#identityName")
    expect(identityName).not.toBeNull()
    await identityName?.type(fake.userName)

    const email = await page.$("#email")
    expect(email).not.toBeNull()
    await email?.type(fake.email)

    const password = await page.$("#password")
    expect(password).not.toBeNull()
    await password?.type(fake.password)

    const submit = await page.$("[type=submit]")
    expect(submit).not.toBeNull()
    const text = await page.evaluate((btn) => btn.textContent, submit)
    expect(text).toBe("Inscription")
    await submit?.click()

    await page.waitForNavigation()

    await cleanupOrganizationFromDb(fake.email)
  })
})
