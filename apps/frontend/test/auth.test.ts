import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { preview } from "vite"
import type { PreviewServer } from "vite"
import puppeteer from "puppeteer"
import type { Browser, Page } from "puppeteer"

describe("signup", async () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    server = await preview({ preview: { port: 3100 } })
    browser = await puppeteer.launch({ headless: false })
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
    await server.httpServer.close()
  })

  test("Successfull signup", async () => {
    try {
      await page.goto("http://localhost:3100/#/signup")
      const organizationName = await page.$("#organizationName")
      expect(organizationName).toBeDefined()
      await organizationName?.type("Organization")

      const submit = await page.$("[type=submit]")
      expect(submit).toBeDefined()
      await submit?.click()

      // await page.waitForNavigation()
    } catch (e) {
      console.error(e)
      expect(e).toBeUndefined()
    }
  })
})
