import { execFileSync } from 'node:child_process'
import { expect, test } from '@playwright/test'

const build = (id?: string) => execFileSync('npm', ['run', 'build'], {
  cwd: process.cwd(),
  env: { ...process.env, ...(id ? { VITE_BUILD_ID: id } : {}) },
  stdio: 'pipe'
})

test('shows and applies an update from a real waiting service worker', async ({ page }) => {
  test.setTimeout(60_000)
  try {
    build('qa-old')
    await page.goto('/demo')
    await page.evaluate(() => navigator.serviceWorker.ready)
    await page.reload()
    await expect(page.locator('footer')).toContainText('vqa-old')
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true)

    build('qa-new')
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration()
      if (!registration) throw new Error('Service worker registration was not found')
      await registration.update()
    })

    await expect(page.getByText('A new version is ready.')).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'Refresh now' }).click()
    await expect(page.locator('footer')).toContainText('vqa-new', { timeout: 15_000 })
  } finally {
    build()
  }
})
