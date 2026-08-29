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
  const unsupported = [
    'type,id,name,color,capacity,parallelSlots,minutes,staffIds,resourceIds,serviceA,serviceB,allowed,note,date,start,staffId,serviceId,client,createdAt',
    'unknown,bad,Unsupported row'
  ].join('\n')
  await page.locator('#import-file').setInputFiles({ name: 'unsupported.csv', mimeType: 'text/csv', buffer: Buffer.from(unsupported) })
  await expect(page.getByRole('alert')).toHaveText('Unsupported CSV row type “unknown”. Nothing was imported.')
  await expect(page.getByText('Ava', { exact: true })).toBeVisible()
  await expect(page.getByText('New client call')).toHaveCount(0)
  await page.getByRole('button', { name: 'Today board' }).click()
  await expect(page.getByText('New client call')).toBeVisible()
  await page.getByRole('button', { name: 'Notebook setup' }).click()
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

test('@claim:conflict-explanation names person, resource, and service-pair blockers', async ({ page }) => {
  await page.goto('/demo')
  await page.getByRole('button', { name: 'Notebook setup' }).click()
  await page.locator('#staff-form input[name="name"]').fill('Maya')
  await page.locator('#staff-form input[name="parallelSlots"]').fill('1')
  await page.getByRole('button', { name: 'Add person' }).click()
  await expect(page.locator('#service-form').getByLabel('Maya')).toBeVisible()
  await page.locator('#service-form input[name="name"]').fill('Chair check')
  await page.locator('#service-form input[name="minutes"]').fill('30')
  await page.locator('#service-form').getByLabel('Maya').check()
  await page.locator('#service-form').getByLabel('Treatment chair').check()
  await page.getByRole('button', { name: 'Add service' }).click()
  await expect(page.locator('.plain-list').getByText('Chair check', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Today board' }).click()
  await page.locator('#board-time').fill('13:15')

  await page.getByRole('button', { name: /Consultation with Ava: blocked, Ava is at capacity/ }).click()
  await expect(page.getByRole('alert')).toContainText('Ava is at capacity')
  await page.getByRole('button', { name: 'Close proposed job' }).click()
  await page.getByRole('button', { name: /Chair check with Maya: blocked, Treatment chair is already in use/ }).click()
  await expect(page.getByRole('alert')).toContainText('Treatment chair is already in use')
  await page.getByRole('button', { name: 'Close proposed job' }).click()
  await expect(page.getByText('Needs attention: Treatment and Mobile visit do not overlap')).toBeVisible()
  await expect(page.getByText('Needs attention: Mobile visit and Treatment do not overlap')).toBeVisible()
})

test('@claim:two-week-review includes day thirteen and excludes day fourteen', async ({ page }) => {
  await page.goto('/demo')
  await page.evaluate(async () => {
    const add = (date: string, days: number) => { const value = new Date(`${date}T12:00:00`); value.setDate(value.getDate() + days); return value.toISOString().slice(0, 10) }
    const database = await new Promise<IDBDatabase>((resolve, reject) => { const opening = indexedDB.open('capacity-map', 1); opening.onsuccess = () => resolve(opening.result); opening.onerror = () => reject(opening.error) })
    const transaction = database.transaction('notebook', 'readwrite'); const store = transaction.objectStore('notebook')
    const data = await new Promise<{ services: { id: string; name: string; minutes: number; staffIds: string[]; resourceIds: string[]; color: string }[]; bookings: { id: string; date: string; start: string; minutes: number; staffId: string; serviceId: string; resourceIds: string[]; client: string; createdAt: number }[] }>((resolve, reject) => { const reading = store.get('demo:capacity'); reading.onsuccess = () => resolve(reading.result); reading.onerror = () => reject(reading.error) })
    const start = new Date().toISOString().slice(0, 10); const day13 = add(start, 13); const day14 = add(start, 14)
    data.services.push(
      { id: 'day-thirteen', name: 'Day thirteen boundary', minutes: 30, staffIds: ['ava'], resourceIds: [], color: '#176b8a' },
      { id: 'day-fourteen', name: 'Day fourteen boundary', minutes: 30, staffIds: ['ava'], resourceIds: [], color: '#176b8a' }
    )
    data.bookings.push(
      { id: 'day13-a', date: day13, start: '08:00', minutes: 30, staffId: 'ava', serviceId: 'day-thirteen', resourceIds: [], client: '', createdAt: 13 },
      { id: 'day13-b', date: day13, start: '08:00', minutes: 30, staffId: 'ava', serviceId: 'consult', resourceIds: [], client: '', createdAt: 14 },
      { id: 'day14-a', date: day14, start: '08:00', minutes: 30, staffId: 'ava', serviceId: 'day-fourteen', resourceIds: [], client: '', createdAt: 15 },
      { id: 'day14-b', date: day14, start: '08:00', minutes: 30, staffId: 'ava', serviceId: 'consult', resourceIds: [], client: '', createdAt: 16 }
    )
    store.put(data, 'demo:capacity')
    await new Promise<void>((resolve, reject) => { transaction.oncomplete = () => resolve(); transaction.onerror = () => reject(transaction.error) })
    database.close()
  })
  await page.reload()
  await page.getByRole('button', { name: 'Two-week review' }).click()
  await expect(page.getByRole('heading', { level: 1, name: '4 capacity checks need attention' })).toBeVisible()
  await expect(page.getByText('Treatment and Mobile visit do not overlap')).toBeVisible()
  await expect(page.getByText('Day thirteen boundary')).toBeVisible()
  await expect(page.getByText('Day fourteen boundary')).toHaveCount(0)
})

test('@claim:daily-license-check verifies a saved license no more than once per day', async ({ page }) => {
  let checks = 0
  await page.route('https://api.sociobot.in/api/v1/products/appointment-capacity-map/verify?license=test-token', async (route) => {
    checks += 1
    if (checks === 1) await new Promise((resolve) => setTimeout(resolve, 300))
    await route.fulfill({ json: { valid: checks === 1, reason: checks === 1 ? 'ok' : 'revoked', expires_at: null } }).catch(() => undefined)
  })
  await page.goto('/?license=test-token')
  await expect.poll(() => checks).toBe(1)
  await page.reload()
  await page.waitForTimeout(400)
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
