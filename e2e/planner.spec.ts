import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('cold first screen states the job, audience, action outcome, and three facts', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Check which service jobs can overlap' })).toBeVisible()
  await expect(page.getByText(/service businesses with two to ten people/i)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible()
  await expect(page.getByText('Loads a separate notebook with a realistic day plan.')).toBeVisible()
  await expect(page.locator('.plain-facts li')).toHaveText([
    'Your plan stays in this browser.',
    'Works offline after the first visit.',
    'Core planning is free. Plus costs $29 once.'
  ])
})

test('loads routes with one heading, history navigation, and no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/')
  await page.getByRole('link', { name: 'Set up my own notebook' }).click()
  await expect(page).toHaveURL(/\/setup$/)
  await expect(page).toHaveTitle('Notebook setup — Capacity Map')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Record team members, services, shared resources, and service-pair rules for capacity checks.')
  await expect(page.getByRole('heading', { level: 1, name: 'Set up your capacity rules' })).toBeFocused()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Set up your capacity rules' })).toBeVisible()
  await page.getByRole('link', { name: /Two-week review/ }).click()
  await expect(page).toHaveURL(/\/review$/)
  await expect(page).toHaveTitle('Two-week review — Capacity Map')
  await page.getByRole('link', { name: 'Privacy' }).first().click()
  await expect(page).toHaveURL(/\/privacy$/)
  await expect(page).toHaveTitle('Privacy — Capacity Map')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Read how Capacity Map stores plans in your browser and checks optional license tokens.')
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', 'Read how Capacity Map stores plans in your browser and checks optional license tokens.')
  await expect(page.locator('h1')).toHaveCount(1)
  await page.goBack()
  await expect(page).toHaveURL(/\/review$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Review two weeks of capacity conflicts' })).toBeFocused()
  expect(errors).toEqual([])
})

test('keeps demo subroutes isolated and gives legal and 404 pages complete metadata', async ({ page, request }) => {
  await page.goto('/demo/setup')
  await expect(page).toHaveTitle('Demo setup — Capacity Map')
  await expect(page.getByText('Demo — sample data, nothing is saved to your notebook')).toBeVisible()
  await expect(page.getByText('Ava', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: /Two-week review/ }).click()
  await expect(page).toHaveURL(/\/demo\/review$/)
  await expect(page).toHaveTitle('Demo review — Capacity Map')
  await page.goto('/terms')
  await expect(page).toHaveTitle('Terms — Capacity Map')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Read the terms for the free Capacity Map planner and the one-time Plus license.')
  const notFound = await request.get('/404.html')
  const html = await notFound.text()
  expect(html).toContain('<header>')
  expect(html).toContain('<footer>')
  expect(html).toContain('name="description"')
  expect(html).toContain('property="og:description"')
  expect(html).toContain('name="twitter:description"')
  expect(html).toContain('href="/privacy"')
  expect(html).toContain('href="/terms"')
  expect(html).toContain('rel="icon"')
})

test('adds and retains a clear job while rejecting malformed CSV without data loss', async ({ page }) => {
  await page.goto('/demo')
  await page.getByRole('button', { name: /Consultation with Leo: bookable/ }).click()
  await page.getByRole('button', { name: 'Add clear job' }).click()
  await expect(page.locator('.booking').filter({ hasText: '09:00' })).toContainText('Consultation')
  await page.reload()
  await expect(page.locator('.booking').filter({ hasText: '09:00' })).toContainText('Consultation')
  await page.getByRole('link', { name: 'Notebook setup' }).click()
  await page.locator('#import-file').setInputFiles({ name: 'broken.csv', mimeType: 'text/csv', buffer: Buffer.from('not,a,capacity,map') })
  await expect(page.getByRole('alert')).toHaveText('This does not look like a Capacity Map CSV.')
  await expect(page.getByText('Ava', { exact: true })).toBeVisible()
})

test('rejects imported jobs assigned to a person who does not provide the service', async ({ page }) => {
  await page.goto('/demo/setup')
  const invalidAssignment = [
    'type,id,name,color,capacity,parallelSlots,minutes,staffIds,resourceIds,serviceA,serviceB,allowed,note,date,start,staffId,serviceId,client,createdAt',
    '"staff","ava","Ava","#176b8a","","1"',
    '"staff","leo","Leo","#a75a18","","1"',
    '"resource","van","Service van","#377353","1"',
    '"service","visit","Mobile visit","#377353","","","60","leo","van"',
    '"booking","wrong-person","","","","","60","","van","","","","","2026-08-28","09:00","ava","visit","","1"'
  ].join('\n')
  await page.locator('#import-file').setInputFiles({ name: 'invalid-assignment.csv', mimeType: 'text/csv', buffer: Buffer.from(invalidAssignment) })
  await expect(page.getByRole('alert')).toHaveText('A job assigns a team member who does not provide its service. Nothing was imported.')
  await expect(page.getByText('Ava', { exact: true })).toBeVisible()
})

test('updates proposal conflicts without losing values and restores keyboard focus', async ({ page }) => {
  await page.goto('/demo')
  const trigger = page.getByRole('button', { name: /Consultation with Ava: bookable/ })
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Check before you book' })).toBeFocused()
  const sheetA11y = await new AxeBuilder({ page }).include('.sheet').analyze()
  expect(sheetA11y.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([])

  const start = page.locator('#booking-form input[name="start"]')
  await start.fill('10:30')
  await expect(page.getByRole('alert')).toContainText('Ava is at capacity')
  await expect(start).toHaveValue('10:30')
  await expect(page.getByRole('button', { name: 'Add clear job' })).toBeDisabled()

  await page.getByRole('button', { name: 'Close proposed job' }).focus()
  await page.keyboard.press('Enter')
  await expect(trigger).toBeFocused()
})

test('confirms setup cascades and never leaves a service without a team member', async ({ page }) => {
  await page.goto('/demo/setup')
  const avaRow = page.locator('.plain-list li').filter({ hasText: 'Ava up to 1 at once' })
  const removeAva = avaRow.getByRole('button', { name: 'Remove' })
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('2 jobs')
    expect(dialog.message()).toContain('1 service with no remaining team member')
    await dialog.dismiss()
  })
  await removeAva.click()
  await expect(page.getByText('Ava', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByText('Ava', { exact: true })).toBeVisible()

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('This cannot be undone.')
    await dialog.accept()
  })
  await page.locator('.plain-list li').filter({ hasText: 'Ava up to 1 at once' }).getByRole('button', { name: 'Remove' }).click()
  await expect(page.getByText('Ava', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Treatment', { exact: true })).toHaveCount(0)
  await page.reload()
  await expect(page.getByText('Ava', { exact: true })).toHaveCount(0)
  await expect(page.locator('.plain-list li').filter({ hasText: 'Leo up to 1 at once' })).toBeVisible()
})

test('rejects an unknown CSV row type without replacing the notebook', async ({ page }) => {
  await page.goto('/demo')
  await page.getByRole('link', { name: 'Notebook setup' }).click()
  const unsupported = [
    'type,id,name,color,capacity,parallelSlots,minutes,staffIds,resourceIds,serviceA,serviceB,allowed,note,date,start,staffId,serviceId,client,createdAt',
    'unknown,bad,Unsupported row'
  ].join('\n')
  await page.locator('#import-file').setInputFiles({ name: 'unsupported.csv', mimeType: 'text/csv', buffer: Buffer.from(unsupported) })
  await expect(page.getByRole('alert')).toHaveText('Unsupported CSV row type “unknown”. Nothing was imported.')
  await expect(page.getByText('Ava', { exact: true })).toBeVisible()
  await page.reload()
  await page.getByRole('link', { name: 'Notebook setup' }).click()
  await expect(page.getByText('Ava', { exact: true })).toBeVisible()
})

test('is keyboard operable and shows a designed focus indicator', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to planner' })
  await expect(skip).toBeFocused()
  expect(await skip.evaluate((element) => getComputedStyle(element).outlineWidth)).toBe('3px')
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/demo$/)
})

test('fits planner navigation at 390px without horizontal clipping', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/demo')
  const dimensions = await page.locator('.tabs').evaluate((element) => ({ client: element.clientWidth, scroll: element.scrollWidth }))
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client)
  await expect(page.getByRole('link', { name: /Two-week review/ })).toBeInViewport()
  await page.getByRole('button', { name: /Consultation with Ava: bookable/ }).click()
  const pageWidth = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
  expect(pageWidth.scroll).toBeLessThanOrEqual(pageWidth.client)
  await page.screenshot({ path: '.factory/evidence/mobile-390.png', fullPage: true })
})

test('respects reduced motion and keeps mobile controls at least 44px high', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/demo')
  expect(await page.locator('.matrix-cell').first().evaluate((element) => parseFloat(getComputedStyle(element).animationDuration))).toBeLessThanOrEqual(0.001)
  await page.getByRole('button', { name: /Consultation with Ava: bookable/ }).click()
  const shortControls = await page.locator('button:visible, a:visible, input:visible, select:visible').evaluateAll((elements) => elements
    .map((element) => ({ name: element.textContent?.trim() || element.getAttribute('aria-label') || element.tagName, height: element.getBoundingClientRect().height }))
    .filter((control) => control.height < 44))
  expect(shortControls).toEqual([])
})

for (const route of ['/', '/setup', '/review', '/demo', '/demo/setup', '/demo/review', '/privacy', '/terms', '/404.html']) {
  test(`has no serious accessibility violations on ${route}`, async ({ page }) => {
    await page.goto(route)
    await page.waitForLoadState('networkidle')
    const report = await new AxeBuilder({ page }).analyze()
    expect(report.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([])
  })
}

test('uses one build version for the cache and install URL', async ({ request }) => {
  const worker = await (await request.get('/sw.js')).text()
  const manifest = await (await request.get('/manifest.webmanifest')).json() as { start_url: string }
  const version = worker.match(/const VERSION="([^"]+)"/)?.[1]
  expect(version).toBeTruthy()
  expect(version).not.toBe('1')
  expect(worker).toContain("const CACHE='capacity-map-'+VERSION")
  expect(worker).toContain("type==='SKIP_WAITING'")
  expect(manifest.start_url).toBe(`/?v=${version}`)
})

test('keeps browser main-thread blocking below 200ms in the sample planner', async ({ page }) => {
  await page.addInitScript(() => {
    const durations: number[] = []
    new PerformanceObserver((list) => durations.push(...list.getEntries().map((entry) => entry.duration - 50))).observe({ type: 'longtask', buffered: true })
    Object.defineProperty(window, '__blocking', { get: () => durations.reduce((sum, value) => sum + Math.max(0, value), 0) })
  })
  await page.goto('/demo')
  await page.waitForTimeout(500)
  const blocking = await page.evaluate(() => (window as typeof window & { __blocking: number }).__blocking)
  expect(blocking).toBeLessThan(200)
})
