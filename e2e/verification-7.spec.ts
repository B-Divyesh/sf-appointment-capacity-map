import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const product = 'appointment-capacity-map'

test('a first-seen license never unlocks Plus when verification cannot finish', async ({ context, page }) => {
  await page.goto('/')
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await page.reload()
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true)

  await context.setOffline(true)
  await page.goto('/review?license=definitely-not-a-valid-license')
  await expect(page.getByRole('link', { name: 'Buy Capacity Map Plus' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'No disallowed overlaps found' })).toHaveCount(0)

  const stored = await page.evaluate((slug) => ({
    token: localStorage.getItem(`sb_license:${slug}`),
    verdict: JSON.parse(localStorage.getItem(`sb_license_check:${slug}`) ?? 'null') as { valid: boolean; token: string } | null
  }), product)
  expect(stored.token).toBe('definitely-not-a-valid-license')
  expect(stored.verdict).toMatchObject({ valid: false, token: 'definitely-not-a-valid-license' })

  await page.reload()
  await expect(page.getByRole('link', { name: 'Buy Capacity Map Plus' })).toBeVisible()
})

test('a recent verified verdict for the same license remains available offline', async ({ context, page }) => {
  await page.goto('/')
  await page.evaluate((slug) => {
    localStorage.setItem(`sb_license:${slug}`, 'verified-token')
    localStorage.setItem(`sb_license_check:${slug}`, JSON.stringify({ valid: true, at: Date.now(), token: 'verified-token' }))
  }, product)
  await page.reload()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await page.reload()
  await context.setOffline(true)
  await page.getByRole('link', { name: /Two-week review/ }).click()
  await expect(page.getByRole('heading', { name: 'No disallowed overlaps found' })).toBeVisible()
})

test('CSV import is reachable and operable from the keyboard', async ({ page }) => {
  await page.goto('/demo/setup')
  await page.getByRole('button', { name: 'Export CSV' }).focus()
  await page.keyboard.press('Tab')
  const importButton = page.getByRole('button', { name: 'Import CSV' })
  await expect(importButton).toBeFocused()

  await importButton.evaluate((button) => button.addEventListener('click', (event) => {
    document.body.dataset.keyboardImport = event.detail === 0 ? 'true' : 'false'
  }))
  await page.keyboard.press('Enter')
  await expect.poll(() => page.locator('body').getAttribute('data-keyboard-import')).toBe('true')
  await page.locator('#import-file').setInputFiles({ name: 'broken.csv', mimeType: 'text/csv', buffer: Buffer.from('not,a,capacity,map') })
  await expect(page.getByRole('alert')).toHaveText('This does not look like a Capacity Map CSV.')
})

test('whitespace-only entities are rejected without mutating the notebook', async ({ page }) => {
  await page.goto('/demo/setup')

  const staffCount = await page.locator('#staff-form + .plain-list > li').count()
  const staffName = page.locator('#staff-form input[name="name"]')
  await staffName.fill('   ')
  await page.locator('#staff-form').getByRole('button', { name: 'Add person' }).click()
  await expect(page.locator('#staff-form + .plain-list > li')).toHaveCount(staffCount)
  await expect(staffName).toHaveValue('   ')
  await expect(staffName).toBeFocused()
  await expect(staffName).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText('Enter a team member name.')).toBeVisible()

  const resourceCount = await page.locator('#resource-form + .plain-list > li').count()
  const resourceName = page.locator('#resource-form input[name="name"]')
  await resourceName.fill('\t ')
  await page.locator('#resource-form').getByRole('button', { name: 'Add resource' }).click()
  await expect(page.locator('#resource-form + .plain-list > li')).toHaveCount(resourceCount)
  await expect(resourceName).toHaveValue('\t ')
  await expect(resourceName).toBeFocused()
  await expect(resourceName).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText('Enter a shared resource name.')).toBeVisible()

  const serviceCount = await page.locator('#service-form + .plain-list > li').count()
  const serviceName = page.locator('#service-form input[name="name"]')
  await serviceName.fill('   ')
  await page.locator('#service-form').getByLabel('Ava').check()
  await page.locator('#service-form').getByRole('button', { name: 'Add service' }).click()
  await expect(page.locator('#service-form + .plain-list > li')).toHaveCount(serviceCount)
  await expect(serviceName).toHaveValue('   ')
  await expect(serviceName).toBeFocused()
  await expect(serviceName).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText('Enter a service name.')).toBeVisible()

  const whitespaceCsv = [
    'type,id,name,color,capacity,parallelSlots,minutes,staffIds,resourceIds,serviceA,serviceB,allowed,note,date,start,staffId,serviceId,client,createdAt',
    '"staff","blank","   ","#176b8a","","1"'
  ].join('\n')
  await page.locator('#import-file').setInputFiles({ name: 'blank-name.csv', mimeType: 'text/csv', buffer: Buffer.from(whitespaceCsv) })
  await expect(page.getByRole('alert')).toHaveText('Each team member needs a name. Nothing was imported.')
  await expect(page.locator('#staff-form + .plain-list > li')).toHaveCount(staffCount)
})

test('a service validation error preserves the form and focuses its described field', async ({ page }) => {
  await page.goto('/demo/setup')
  const name = page.locator('#service-form input[name="name"]')
  const minutes = page.locator('#service-form input[name="minutes"]')
  const resource = page.locator('#service-form').getByLabel('Treatment chair')
  await name.fill('Urgent repair')
  await minutes.fill('45')
  await resource.check()
  await page.locator('#service-form').getByRole('button', { name: 'Add service' }).click()

  await expect(name).toHaveValue('Urgent repair')
  await expect(minutes).toHaveValue('45')
  await expect(resource).toBeChecked()
  const staffGroup = page.locator('#service-staff-group')
  await expect(staffGroup).toBeFocused()
  await expect(staffGroup).toHaveAttribute('aria-invalid', 'true')
  const errorId = await staffGroup.getAttribute('aria-describedby')
  expect(errorId).toBeTruthy()
  await expect(page.locator(`#${errorId}`)).toHaveText('Choose at least one team member.')
  const report = await new AxeBuilder({ page }).include('#service-form').analyze()
  expect(report.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([])
})

test.describe('local calendar date', () => {
  test.use({ timezoneId: 'Asia/Tokyo' })

  test('uses the browser day for the board, demo seed, and CSV filename', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-08-29T20:03:06Z'))
    await page.goto('/demo')
    await expect(page.locator('#board-date')).toHaveValue('2026-08-30')
    await expect(page.locator('.booking')).toHaveCount(3)

    await page.getByRole('link', { name: 'Notebook setup' }).click()
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Export CSV' }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe('capacity-map-2026-08-30.csv')
  })
})

test('the public footer discloses the generated notebook art', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('footer')).toContainText('Notebook art was generated for Capacity Map.')
})
