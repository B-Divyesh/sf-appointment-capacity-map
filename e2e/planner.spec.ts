import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('models a clear job and remains usable offline after first visit', async ({ page, context }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Try a guided example' }).click()
  await expect(page.getByRole('heading', { name: 'What can book now' })).toBeVisible()
  await page.getByRole('button', { name: /Consultation with Ava: bookable/ }).click()
  await expect(page.getByText('Clear to book')).toBeVisible()
  await page.getByRole('button', { name: 'Add clear job' }).click()
  await expect(page.getByText('Jobs on this day')).toBeVisible()
  await page.evaluate(() => navigator.serviceWorker.ready)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'What can book now' })).toBeVisible()
})

test('has no serious accessibility violations on the empty notebook', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
  const report = await new AxeBuilder({ page }).analyze()
  expect(report.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([])
})
