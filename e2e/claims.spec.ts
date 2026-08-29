import { expect, test } from '@playwright/test'

test('@claim:demo-isolation sample mode is one click and isolated from the real notebook', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Try it with sample data' }).click()
  await expect(page).toHaveURL(/\/demo$/)
  await expect(page.getByText('Demo — sample data, nothing is saved to your notebook')).toBeVisible()
  await expect(page.getByText('New client call')).toBeVisible()
  expect(await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const opening = indexedDB.open('capacity-map', 1)
      opening.onsuccess = () => resolve(opening.result)
      opening.onerror = () => reject(opening.error)
    })
    const keys = await new Promise<IDBValidKey[]>((resolve, reject) => {
      const request = database.transaction('notebook').objectStore('notebook').getAllKeys()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    database.close()
    return keys
  })).toEqual(['demo:capacity'])
  await page.getByRole('button', { name: 'Start for real' }).click()
  await expect(page.getByRole('heading', { name: 'Check which service jobs can overlap' })).toBeVisible()
  await expect(page.getByText('New client call')).toHaveCount(0)
  expect(await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve) => { const opening = indexedDB.open('capacity-map', 1); opening.onsuccess = () => resolve(opening.result) })
    const keys = await new Promise<IDBValidKey[]>((resolve) => { const request = database.transaction('notebook').objectStore('notebook').getAllKeys(); request.onsuccess = () => resolve(request.result) })
    database.close(); return keys
  })).toEqual([])
})

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo')
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await expect(page.getByText('New client call')).toBeVisible()
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Check which service jobs can overlap' })).toBeVisible()
  await expect(page.getByText('New client call')).toBeVisible()
})

test('@claim:csv-roundtrip exports every sample row and imports a replacement plan', async ({ page }) => {
  await page.goto('/demo')
  await page.getByRole('button', { name: 'Notebook setup' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export CSV' }).click()
  const download = await downloadPromise
  const stream = await download.createReadStream()
  let exported = ''
  for await (const part of stream) exported += part.toString()
  expect(exported.split('\n')[0]).toContain('type,id,name')
  expect(exported.trim().split('\n')).toHaveLength(12)
  const replacement = [
    'type,id,name,color,capacity,parallelSlots,minutes,staffIds,resourceIds,serviceA,serviceB,allowed,note,date,start,staffId,serviceId,client,createdAt',
    '"staff","sam","Imported Sam","#176b8a","","1"',
    '"service","repair","Imported Repair","#176b8a","","","30","sam",""'
  ].join('\n')
  await page.locator('#import-file').setInputFiles({ name: 'replacement.csv', mimeType: 'text/csv', buffer: Buffer.from(replacement) })
  await expect(page.getByText('Imported Sam', { exact: true })).toBeVisible()
  await expect(page.getByText('Ava', { exact: true })).toHaveCount(0)
})

test('@claim:privacy-local-only keeps the demo planning flow on the product origin', async ({ page }) => {
  const origins = new Set<string>()
  page.on('request', (request) => origins.add(new URL(request.url()).origin))
  await page.goto('/demo')
  await page.getByRole('button', { name: /Consultation with Leo: bookable/ }).click()
  await page.getByRole('button', { name: 'Add clear job' }).click()
  await page.getByRole('button', { name: 'Notebook setup' }).click()
  await expect(page.getByRole('button', { name: 'Export CSV' })).toBeVisible()
  expect([...origins]).toEqual(['http://127.0.0.1:4174'])
})

test('@claim:conflict-explanation names the rule behind a blocked overlap', async ({ page }) => {
  await page.goto('/demo')
  await expect(page.getByText('Needs attention: Treatment and Mobile visit do not overlap')).toBeVisible()
  await expect(page.getByText('Needs attention: Mobile visit and Treatment do not overlap')).toBeVisible()
})

test('@claim:two-week-review groups demo conflicts across fourteen days', async ({ page }) => {
  await page.goto('/demo')
  await page.getByRole('button', { name: 'Two-week review' }).click()
  await expect(page.getByRole('heading', { level: 1, name: '2 capacity checks need attention' })).toBeVisible()
  await expect(page.getByText('Treatment and Mobile visit do not overlap')).toBeVisible()
})

test('@claim:daily-license-check verifies a saved license no more than once per day', async ({ page }) => {
  let checks = 0
  await page.route('https://api.sociobot.in/api/v1/products/appointment-capacity-map/verify?license=test-token', async (route) => {
    checks += 1
    await route.fulfill({ json: { valid: checks === 1, reason: checks === 1 ? 'ok' : 'revoked', expires_at: null } })
  })
  await page.goto('/?license=test-token')
  await expect.poll(() => checks).toBe(1)
  await page.reload()
  await page.waitForTimeout(100)
  expect(checks).toBe(1)
  await page.evaluate(() => localStorage.setItem('sb_license_check:appointment-capacity-map', JSON.stringify({ valid: true, at: Date.now() - 86_400_001 })))
  await page.reload()
  await expect.poll(() => checks).toBe(2)
  await expect(page.getByText('This license is no longer active. Your local plan is unchanged.')).toBeVisible()
  await page.getByRole('button', { name: /Two-week review/ }).click()
  await expect(page.getByRole('link', { name: 'Buy Capacity Map Plus' })).toBeVisible()
})

test('@claim:plus-price shows the $29 one-time purchase and registered checkout', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Two-week review' }).click()
  await expect(page.getByText('$29 one-time purchase')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Buy Capacity Map Plus' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/appointment-capacity-map/checkout')
})
