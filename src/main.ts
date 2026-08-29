import './styles.css'
import art from './assets/capacity-notebook.webp'
import { clear, load, save, type StorageMode } from './db'
import { availabilityFor, conflictsFor, resourceById, seededData, serviceById, staffById } from './rules'
import { emptyData, id, today, type Booking, type Data, type Id } from './types'

type Page = 'board' | 'setup' | 'review' | 'privacy' | 'terms'
type AppRoute = '/' | '/setup' | '/review' | '/demo' | '/demo/setup' | '/demo/review' | '/privacy' | '/terms'
type Draft = Omit<Booking, 'id' | 'createdAt'>
const app = document.querySelector<HTMLDivElement>('#app')!
const PRODUCT = 'appointment-capacity-map'
const colours = ['#176b8a', '#b94e45', '#377353', '#a75a18', '#73518a']
const CSV_HEADER = 'type,id,name,color,capacity,parallelSlots,minutes,staffIds,resourceIds,serviceA,serviceB,allowed,note,date,start,staffId,serviceId,client,createdAt'
const CSV_TYPES = new Set(['staff', 'resource', 'service', 'rule', 'booking'])
const LICENSE_CHECK_MS = 86_400_000
const initialUrl = new URL(location.href)
const pageFromPath = (path: string): Page => path === '/privacy' ? 'privacy' : path === '/terms' ? 'terms' : path.endsWith('/setup') ? 'setup' : path.endsWith('/review') ? 'review' : 'board'
let demoMode = initialUrl.pathname === '/demo' || initialUrl.pathname.startsWith('/demo/') || initialUrl.searchParams.get('demo') === '1'
let data: Data = emptyData(); let page: Page = pageFromPath(initialUrl.pathname); let day = today(); let time = '09:00'; let draft: Draft | null = null
let message = ''; let licensed = false; let importError = ''; let updateWaiting: ServiceWorker | null = null

const esc = (value: string | number) => String(value).replace(/[&<>'"]/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[s]!))
const csv = (v: string | number | undefined) => `"${String(v ?? '').replaceAll('"', '""')}"`
const dateAdd = (d: string, n: number) => { const out = new Date(`${d}T12:00:00`); out.setDate(out.getDate() + n); return out.toISOString().slice(0, 10) }
const prettyDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

const storageMode = (): StorageMode => demoMode ? 'demo' : 'real'
const hasPlan = (value: Data) => value.staff.length > 0 || value.services.length > 0 || value.resources.length > 0 || value.rules.length > 0 || value.bookings.length > 0
const markClass = (color: string | undefined) => `mark-${Math.max(0, colours.indexOf(color ?? ''))}`
async function persist(note = demoMode ? 'Saved in this demo' : 'Saved on this device') { await save(data, storageMode()); message = note; render(); setTimeout(() => { if (message === note) { message = ''; render() } }, 2200) }
function serviceName(value: Id) { return serviceById(data, value)?.name ?? 'Unknown service' }
function staffName(value: Id) { return staffById(data, value)?.name ?? 'Unknown team member' }
function resourceNames(values: Id[]) { return values.map((x) => resourceById(data, x)?.name).filter(Boolean).join(', ') || 'No shared resource' }

function nav() {
  const items: [Page, string][] = [['board', 'Today board'], ['setup', 'Notebook setup'], ['review', 'Two-week review']]
  return `<nav aria-label="Planner sections" class="tabs">${items.map(([key, text]) => { const route = key === 'board' ? (demoMode ? '/demo' : '/') : `${demoMode ? '/demo' : ''}/${key}`; return `<a href="${route}" class="tab ${page === key ? 'active' : ''}" data-route="${route}" ${page === key ? 'aria-current="page"' : ''}>${text}${key === 'review' && !licensed ? '<span class="mini-lock" aria-label="Paid">◆</span>' : ''}</a>` }).join('')}</nav>`
}

function renderBoard() {
  if (!data.services.length || !data.staff.length) return `<section class="empty-state"><img src="${art}" width="900" height="600" alt="An overhead notebook grid with coloured planning tokens." /><div><p class="eyebrow">Capacity Map</p><h1>Check which service jobs can overlap</h1><p class="audience">For service businesses with two to ten people who need clear answers before adding work to the calendar.</p><div class="button-row hero-actions"><a class="primary button-link" href="/demo" data-route="/demo">Try it with sample data</a><span>Loads a separate notebook with a realistic day plan.</span></div><a class="button-link" href="/setup" data-route="/setup">Set up my own notebook</a><ul class="plain-facts"><li>Your plan stays in this browser.</li><li>Works offline after the first visit.</li><li>Core planning is free. Plus costs $29 once.</li></ul></div></section><section class="landing-section" aria-labelledby="how-title"><h2 id="how-title">How it works</h2><ol class="steps"><li><b>Add your capacity.</b><span>Record people, services, equipment, and limits.</span></li><li><b>Choose a time.</b><span>See which jobs fit before changing your calendar.</span></li><li><b>Read the reason.</b><span>Each blocked slot names the person, item, or rule.</span></li></ol></section><section class="landing-section restrained" aria-labelledby="limits-title"><h2 id="limits-title">Your browser holds the plan</h2><p>Capacity Map does not connect to calendars, take bookings, or track employees.</p><p>You choose when to import or export a CSV file.</p></section><section class="landing-section plus-note" aria-labelledby="plus-title"><h2 id="plus-title">Review two weeks with Plus</h2><p>Capacity Map Plus lists conflicts across fourteen days. It costs $29 as a one-time purchase.</p><a class="button-link" href="/review" data-route="/review">See Plus details</a></section>`
  const bookings = data.bookings.filter((b) => b.date === day).sort((a, b) => a.start.localeCompare(b.start))
  const cells = data.services.flatMap((service) => service.staffIds.map((staffId) => {
    const issues = availabilityFor(data, service, staffId, day, time)
    return `<button class="matrix-cell ${issues.length ? 'blocked' : 'clear'}" data-propose="${service.id}|${staffId}" aria-label="${esc(service.name)} with ${esc(staffName(staffId))}: ${issues.length ? `blocked, ${esc(issues[0].label)}` : 'bookable'}"><span class="dot ${markClass(service.color)}"></span><span><strong>${esc(service.name)}</strong><small>with ${esc(staffName(staffId))} · ${service.minutes} min</small></span><b>${issues.length ? 'Blocked' : 'Book now'}</b></button>`
  })).join('')
  return `<h1 class="page-title">Check which service jobs can overlap</h1><section class="board-head"><div><p class="eyebrow">Capacity board</p><h2>${prettyDate(day)}</h2><p>Choose a start time, then read the reason beside every possible job.</p></div><div class="date-tools"><label>Date <input id="board-date" type="date" value="${day}"></label><label>Start <input id="board-time" type="time" value="${time}"></label></div></section>${draft ? bookingSheet() : ''}<section class="matrix" aria-labelledby="now-title"><div class="section-label"><h2 id="now-title">What can book now</h2><span>${esc(time)} start</span></div><div class="matrix-list">${cells}</div></section><section class="day-list" aria-labelledby="day-title"><div class="section-label"><h2 id="day-title">Jobs on this day</h2><button class="text-button" data-new-booking>Add a job</button></div>${bookings.length ? `<ol>${bookings.map(bookingCard).join('')}</ol>` : '<p class="quiet">No jobs recorded. The board is clear.</p>'}</section>`
}

function bookingCard(b: Booking) {
  const issues = conflictsFor(data, b)
  return `<li class="booking"><span class="time">${esc(b.start)}<small>${b.minutes} min</small></span><span class="booking-mark ${markClass(serviceById(data, b.serviceId)?.color)}"></span><div><strong>${esc(serviceName(b.serviceId))}</strong><span>${esc(staffName(b.staffId))} · ${esc(resourceNames(b.resourceIds))}${b.client ? ` · ${esc(b.client)}` : ''}</span>${issues.length ? `<em class="problem">Needs attention: ${esc(issues[0].label)}</em>` : ''}</div><button class="icon-button" data-delete-booking="${b.id}" aria-label="Delete ${esc(serviceName(b.serviceId))} at ${esc(b.start)}">×</button></li>`
}

function bookingSheet() {
  const service = serviceById(data, draft!.serviceId); const issues = service ? conflictsFor(data, { ...draft!, id: 'new', createdAt: 0 }) : []
  return `<section class="sheet" aria-labelledby="job-title"><div class="sheet-heading"><div><p class="eyebrow">Proposed job</p><h2 id="job-title">Check before you book</h2></div><button class="icon-button" data-cancel-draft aria-label="Close proposed job">×</button></div><form id="booking-form"><div class="form-grid"><label>Service <select name="serviceId" required>${data.services.map((x) => `<option value="${x.id}" ${x.id === draft!.serviceId ? 'selected' : ''}>${esc(x.name)} · ${x.minutes} min</option>`).join('')}</select></label><label>Team member <select name="staffId" required>${data.staff.filter((x) => service?.staffIds.includes(x.id)).map((x) => `<option value="${x.id}" ${x.id === draft!.staffId ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></label><label>Date <input name="date" type="date" value="${draft!.date}" required></label><label>Start <input name="start" type="time" value="${draft!.start}" required></label><label>Length (minutes) <input name="minutes" type="number" min="5" step="5" value="${draft!.minutes}" required></label><label>Reference (optional) <input name="client" maxlength="80" value="${esc(draft!.client)}" placeholder="e.g. Jones repair"></label></div><p class="resource-note"><b>Shared resources:</b> ${esc(service ? resourceNames(service.resourceIds) : 'Select a service')}</p>${issues.length ? `<div class="explanation danger" role="alert"><strong>Cannot add this job yet</strong>${issues.map((x) => `<span>${esc(x.label)} — ${esc(x.detail)}</span>`).join('')}</div>` : '<div class="explanation good"><strong>Clear to book</strong><span>The selected person, resources, and service rules all have capacity.</span></div>'}<div class="button-row"><button class="primary" ${issues.length ? 'disabled' : ''}>Add clear job</button><button type="button" data-cancel-draft>Cancel</button></div></form></section>`
}

function setupView() {
  return `<section class="setup-intro"><p class="eyebrow">Notebook setup</p><h1>Set up your capacity rules</h1><p>Names and planning details stay in this ${demoMode ? 'demo' : 'browser'}. There are no calendars to connect and no employee tracking fields.</p></section><div class="setup-grid"><section class="setup-section"><h2>1. Team members</h2><form id="staff-form" class="inline-form"><label>Name <input name="name" required maxlength="40"></label><label>Parallel jobs <input name="parallelSlots" type="number" min="1" max="5" value="1" required></label><button class="primary">Add person</button></form>${data.staff.length ? `<ul class="plain-list">${data.staff.map((x) => `<li><i class="${markClass(x.color)}"></i>${esc(x.name)} <span>up to ${x.parallelSlots} at once</span><button class="text-button danger-text" data-remove="staff|${x.id}">Remove</button></li>`).join('')}</ul>` : '<p class="quiet">No team members yet.</p>'}</section><section class="setup-section"><h2>2. Shared resources</h2><form id="resource-form" class="inline-form"><label>Name <input name="name" required maxlength="40" placeholder="e.g. Treatment chair"></label><label>Units <input name="capacity" type="number" min="1" max="20" value="1" required></label><button class="primary">Add resource</button></form>${data.resources.length ? `<ul class="plain-list">${data.resources.map((x) => `<li><i class="${markClass(x.color)}"></i>${esc(x.name)} <span>${x.capacity} available</span><button class="text-button danger-text" data-remove="resource|${x.id}">Remove</button></li>`).join('')}</ul>` : '<p class="quiet">No shared things needed yet.</p>'}</section><section class="setup-section wide"><h2>3. Services</h2><form id="service-form" class="service-form"><label>Name <input name="name" required maxlength="40" placeholder="e.g. Initial consult"></label><label>Minutes <input name="minutes" type="number" min="5" step="5" value="30" required></label><fieldset><legend>Who can provide it?</legend>${data.staff.length ? data.staff.map((x) => `<label class="check"><input type="checkbox" name="staffIds" value="${x.id}"> ${esc(x.name)}</label>`).join('') : '<span class="quiet">Add people first.</span>'}</fieldset><fieldset><legend>What does it use?</legend>${data.resources.length ? data.resources.map((x) => `<label class="check"><input type="checkbox" name="resourceIds" value="${x.id}"> ${esc(x.name)}</label>`).join('') : '<span class="quiet">None — or add a shared resource.</span>'}</fieldset><button class="primary" ${data.staff.length ? '' : 'disabled'}>Add service</button></form>${data.services.length ? `<ul class="plain-list">${data.services.map((x) => `<li><i class="${markClass(x.color)}"></i><span><b>${esc(x.name)}</b> · ${x.minutes} min <small>${esc(x.staffIds.map(staffName).join(', '))}; ${esc(resourceNames(x.resourceIds))}</small></span><button class="text-button danger-text" data-remove="service|${x.id}">Remove</button></li>`).join('')}</ul>` : '<p class="quiet">No services yet.</p>'}</section><section class="setup-section wide"><h2>4. Service-pair rules</h2><p class="quiet">Use a no-overlap rule when two job types cannot run together even with different people and equipment.</p><form id="rule-form" class="rule-form"><label>First service <select name="serviceA">${data.services.map((x) => `<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></label><label>Cannot overlap with <select name="serviceB">${data.services.map((x) => `<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></label><label>Why? <input name="note" maxlength="120" placeholder="e.g. requires a shared hand-off"></label><button class="primary" ${data.services.length < 2 ? 'disabled' : ''}>Add rule</button></form>${data.rules.length ? `<ul class="plain-list">${data.rules.map((x) => `<li><span><b>${esc(serviceName(x.serviceA))}</b> × <b>${esc(serviceName(x.serviceB))}</b><small>${esc(x.note || 'No overlap')}</small></span><button class="text-button danger-text" data-remove="rule|${x.id}">Remove</button></li>`).join('')}</ul>` : '<p class="quiet">No extra pair rules.</p>'}</section></div><section class="data-tools"><h2>Keep a copy</h2><p>Export a portable CSV at any time. Importing replaces this notebook after its rows are checked.</p><div class="button-row"><button data-export>Export CSV</button><label class="file-button">Import CSV <input id="import-file" type="file" accept=".csv,text/csv"></label><button class="text-button danger-text" data-clear>Start a blank notebook</button></div>${importError ? `<p class="error-text" role="alert">${esc(importError)}</p>` : ''}</section>`
}

function reviewView() {
  if (!licensed) return `<section class="unlock"><p class="eyebrow">Capacity Map Plus</p><h1>Review two weeks of capacity conflicts</h1><p>Plus groups conflicting jobs by their staff, resource, or service-pair reason. Core planning and CSV export stay free.</p><p class="price"><b>$29</b> one-time purchase</p><div class="button-row"><a class="primary button-link" href="https://api.sociobot.in/api/v1/products/${PRODUCT}/checkout">Buy Capacity Map Plus</a><button data-restore>Paste a license</button></div><p class="quiet">Sociobot / Dodo is merchant of record. Refunds revoke the license. <a href="/terms" data-route="/terms">Read the terms</a>.</p></section>`
  const issues: { date: string; booking: Booking; reason: string }[] = []
  for (let offset = 0; offset < 14; offset++) for (const booking of data.bookings.filter((b) => b.date === dateAdd(day, offset))) for (const issue of conflictsFor(data, booking)) issues.push({ date: booking.date, booking, reason: issue.label })
  return `<section class="review"><p class="eyebrow">Two-week review${demoMode ? ' · sample preview' : ''}</p><h1>${issues.length ? `${issues.length} capacity checks need attention` : 'No disallowed overlaps found'}</h1><p>${prettyDate(day)} through ${prettyDate(dateAdd(day, 13))}. This uses the same explainable rules as the live board.</p>${issues.length ? `<ol class="review-list">${issues.map((x) => `<li><b>${esc(prettyDate(x.date))} · ${esc(x.booking.start)}</b><span>${esc(serviceName(x.booking.serviceId))} with ${esc(staffName(x.booking.staffId))}</span><em>${esc(x.reason)}</em></li>`).join('')}</ol>` : '<div class="explanation good"><strong>Clear plan</strong><span>Add more jobs or move the review window with the board date.</span></div>'}</section>`
}

function legal(kind: 'privacy' | 'terms') { return kind === 'privacy' ? `<article class="legal"><h1>Privacy</h1><p>Capacity Map stores your team, service, resource, and job-plan records only in this browser’s IndexedDB. It does not send them to us, use analytics, or track employees.</p><p>A license token is stored in this browser only to enable Plus. When online, it may be checked with Sociobot’s licensing service no more than once a day. CSV import and export start only when you choose them.</p><p><a href="/" data-route="/">Return to the planner</a></p></article>` : `<article class="legal"><h1>Terms</h1><p>Capacity Map is a planning aid. You remain responsible for checking real-world staffing, safety, and customer commitments. The free planner is provided as-is.</p><p>Capacity Map Plus is a one-time license sold by Sociobot / Dodo, the merchant of record. A refund or revocation disables Plus; core local records remain yours and exportable.</p><p><a href="/" data-route="/">Return to the planner</a></p></article>` }

function setMetadata() {
  const metadata: Record<Page, { title: string; description: string }> = {
    board: demoMode
      ? { title: 'Demo — Capacity Map', description: 'Try a sample service plan and check job overlaps without changing your notebook.' }
      : { title: 'Capacity Map — check service job overlaps', description: "Check which service jobs can overlap before adding work to a small team's calendar." },
    setup: { title: `${demoMode ? 'Demo setup' : 'Notebook setup'} — Capacity Map`, description: 'Record team members, services, shared resources, and service-pair rules for capacity checks.' },
    review: { title: `${demoMode ? 'Demo review' : 'Two-week review'} — Capacity Map`, description: 'Review fourteen days of job conflicts grouped by the staff, resource, or service-pair reason.' },
    privacy: { title: 'Privacy — Capacity Map', description: 'Read how Capacity Map stores plans in your browser and checks optional license tokens.' },
    terms: { title: 'Terms — Capacity Map', description: 'Read the terms for the free Capacity Map planner and the one-time Plus license.' }
  }
  const { title: routeTitle, description } = metadata[page]
  const canonicalPath = page === 'privacy' || page === 'terms' ? `/${page}` : page === 'board' ? (demoMode ? '/demo' : '/') : `${demoMode ? '/demo' : ''}/${page}`
  document.title = routeTitle
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://appointment-capacity-map.sociobot.in${canonicalPath}`)
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description)
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', routeTitle)
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description)
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', `https://appointment-capacity-map.sociobot.in${canonicalPath}`)
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', routeTitle)
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', description)
}

function render(focusHeading = false) {
  const content = page === 'board' ? renderBoard() : page === 'setup' ? setupView() : page === 'review' ? reviewView() : legal(page)
  const demoBanner = demoMode ? '<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved to your notebook</strong><span><button data-reset-demo>Reset demo</button><button data-start-real>Start for real</button></span></aside>' : ''
  app.innerHTML = `<div class="route-announcer sr-only" aria-live="polite"></div><header><a class="brand" href="/" data-route="/" aria-label="Capacity Map home"><span class="brand-mark">⌘</span><span>Capacity <i>Map</i></span></a><nav aria-label="Site"><a href="/demo" data-route="/demo">Demo</a><a href="/privacy" data-route="/privacy">Privacy</a></nav><span class="local-status" aria-live="polite">${demoMode ? 'Separate demo notebook' : navigator.onLine ? 'Saved on this device' : 'Offline — saved on this device'}</span></header>${demoBanner}${page === 'privacy' || page === 'terms' ? '' : nav()}<main id="main" tabindex="-1">${content}</main><footer><span>Local-first planning notebook. Original generated illustration.</span><span><a href="/privacy" data-route="/privacy">Privacy</a> · <a href="/terms" data-route="/terms">Terms</a> · <a href="https://sociobot.in">Built by Param Factory</a> · v${__BUILD_VERSION__}</span></footer>${message ? `<div class="toast" role="status">${esc(message)}</div>` : ''}${updateWaiting ? '<div class="update-toast" role="status">A new version is ready. <button data-update>Refresh now</button></div>' : ''}`
  setMetadata()
  wire()
  if (focusHeading) {
    const heading = app.querySelector<HTMLHeadingElement>('h1')
    if (heading) { heading.tabIndex = -1; heading.focus(); app.querySelector('.route-announcer')!.textContent = heading.textContent }
  }
}

async function routeTo(path: AppRoute, replace = false) {
  const nextDemo = path === '/demo' || path.startsWith('/demo/')
  const leavingDemo = demoMode && !nextDemo
  if (leavingDemo) await clear('demo')
  if (nextDemo !== demoMode) {
    demoMode = nextDemo
    data = await load(storageMode())
    if (demoMode && !hasPlan(data)) { data = seededData(day); await save(data, 'demo') }
    licensed = demoMode
    if (!demoMode) setupLicense()
  }
  page = pageFromPath(path)
  draft = null
  if (replace) history.replaceState({}, '', path); else history.pushState({}, '', path)
  render(true)
}

function inputValues(form: HTMLFormElement, key: string) { return [...form.querySelectorAll<HTMLInputElement>(`input[name="${key}"]:checked`)].map((x) => x.value) }
function wire() {
  app.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach((el) => el.onclick = (event) => { event.preventDefault(); void routeTo(el.dataset.route as AppRoute) })
  app.querySelectorAll<HTMLButtonElement>('[data-propose]').forEach((el) => el.onclick = () => { const [serviceId, staffId] = el.dataset.propose!.split('|'); const service = serviceById(data, serviceId)!; draft = { serviceId, staffId, date: day, start: time, minutes: service.minutes, resourceIds: service.resourceIds, client: '' }; render() })
  app.querySelector<HTMLButtonElement>('[data-new-booking]')?.addEventListener('click', () => { const service = data.services[0]; draft = { serviceId: service.id, staffId: service.staffIds[0], date: day, start: time, minutes: service.minutes, resourceIds: service.resourceIds, client: '' }; render() })
  app.querySelectorAll<HTMLButtonElement>('[data-cancel-draft]').forEach((el) => el.onclick = () => { draft = null; render() })
  app.querySelector<HTMLInputElement>('#board-date')?.addEventListener('change', (e) => { day = (e.target as HTMLInputElement).value; render() })
  app.querySelector<HTMLInputElement>('#board-time')?.addEventListener('change', (e) => { time = (e.target as HTMLInputElement).value; render() })
  app.querySelector<HTMLFormElement>('#booking-form')?.addEventListener('submit', async (e) => { e.preventDefault(); const f = new FormData(e.currentTarget as HTMLFormElement); const service = serviceById(data, String(f.get('serviceId')))!; const next: Booking = { id: id(), date: String(f.get('date')), start: String(f.get('start')), minutes: Number(f.get('minutes')), staffId: String(f.get('staffId')), serviceId: service.id, resourceIds: service.resourceIds, client: String(f.get('client')).trim(), createdAt: Date.now() }; if (conflictsFor(data, next).length) { message = 'That job changed and is no longer clear.'; render(); return } data.bookings.push(next); draft = null; await persist('Clear job added') })
  app.querySelectorAll<HTMLButtonElement>('[data-delete-booking]').forEach((el) => el.onclick = async () => { const b = data.bookings.find((x) => x.id === el.dataset.deleteBooking)!; if (confirm(`Remove ${serviceName(b.serviceId)} at ${b.start}?`)) { data.bookings = data.bookings.filter((x) => x.id !== b.id); await persist('Job removed') } })
  app.querySelector<HTMLButtonElement>('[data-reset-demo]')?.addEventListener('click', async () => { data = seededData(day); await save(data, 'demo'); page = 'board'; message = 'Demo reset to its sample plan'; render() })
  app.querySelector<HTMLButtonElement>('[data-start-real]')?.addEventListener('click', () => { void routeTo('/') })
  app.querySelector<HTMLFormElement>('#staff-form')?.addEventListener('submit', async (e) => { e.preventDefault(); const f = new FormData(e.currentTarget as HTMLFormElement); data.staff.push({ id: id(), name: String(f.get('name')).trim(), parallelSlots: Number(f.get('parallelSlots')), color: colours[data.staff.length % colours.length] }); await persist('Team member added') })
  app.querySelector<HTMLFormElement>('#resource-form')?.addEventListener('submit', async (e) => { e.preventDefault(); const f = new FormData(e.currentTarget as HTMLFormElement); data.resources.push({ id: id(), name: String(f.get('name')).trim(), capacity: Number(f.get('capacity')), color: colours[data.resources.length % colours.length] }); await persist('Resource added') })
  app.querySelector<HTMLFormElement>('#service-form')?.addEventListener('submit', async (e) => { e.preventDefault(); const f = e.currentTarget as HTMLFormElement; const fd = new FormData(f); const staffIds = inputValues(f, 'staffIds'); if (!staffIds.length) { message = 'Choose at least one team member.'; render(); return } data.services.push({ id: id(), name: String(fd.get('name')).trim(), minutes: Number(fd.get('minutes')), staffIds, resourceIds: inputValues(f, 'resourceIds'), color: colours[data.services.length % colours.length] }); await persist('Service added') })
  app.querySelector<HTMLFormElement>('#rule-form')?.addEventListener('submit', async (e) => { e.preventDefault(); const f = new FormData(e.currentTarget as HTMLFormElement); if (f.get('serviceA') === f.get('serviceB')) { message = 'Choose two different services for a pair rule.'; render(); return } data.rules.push({ id: id(), serviceA: String(f.get('serviceA')), serviceB: String(f.get('serviceB')), allowed: false, note: String(f.get('note')).trim() }); await persist('Pair rule added') })
  app.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach((el) => el.onclick = async () => { const [type, removeId] = el.dataset.remove!.split('|'); if (type === 'staff') { data.staff = data.staff.filter((x) => x.id !== removeId); data.services.forEach((x) => x.staffIds = x.staffIds.filter((v) => v !== removeId)); data.bookings = data.bookings.filter((x) => x.staffId !== removeId) } if (type === 'resource') { data.resources = data.resources.filter((x) => x.id !== removeId); data.services.forEach((x) => x.resourceIds = x.resourceIds.filter((v) => v !== removeId)); data.bookings.forEach((x) => x.resourceIds = x.resourceIds.filter((v) => v !== removeId)) } if (type === 'service') { data.services = data.services.filter((x) => x.id !== removeId); data.rules = data.rules.filter((x) => x.serviceA !== removeId && x.serviceB !== removeId); data.bookings = data.bookings.filter((x) => x.serviceId !== removeId) } if (type === 'rule') data.rules = data.rules.filter((x) => x.id !== removeId); await persist('Item removed; dependent plan entries were updated') })
  app.querySelector<HTMLButtonElement>('[data-export]')?.addEventListener('click', exportCsv)
  app.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', importCsv)
  app.querySelector<HTMLButtonElement>('[data-clear]')?.addEventListener('click', async () => { if (confirm('Start a blank notebook? Export first if you may need this plan.')) { data = emptyData(); await persist('Blank notebook ready') } })
  app.querySelector<HTMLButtonElement>('[data-restore]')?.addEventListener('click', () => { const token = prompt('Paste your Capacity Map license token'); if (token?.trim()) activateLicense(token.trim()) })
  app.querySelector<HTMLButtonElement>('[data-update]')?.addEventListener('click', () => updateWaiting?.postMessage({ type: 'SKIP_WAITING' }))
}

function exportCsv() {
  const sourceRows: (string | number)[][] = [
    ...data.staff.map((x) => ['staff', x.id, x.name, x.color, '', x.parallelSlots]),
    ...data.resources.map((x) => ['resource', x.id, x.name, x.color, x.capacity]),
    ...data.services.map((x) => ['service', x.id, x.name, x.color, '', '', x.minutes, x.staffIds.join('|'), x.resourceIds.join('|')]),
    ...data.rules.map((x) => ['rule', x.id, '', '', '', '', '', '', '', x.serviceA, x.serviceB, String(x.allowed), x.note]),
    ...data.bookings.map((x) => ['booking', x.id, '', '', '', '', x.minutes, '', x.resourceIds.join('|'), '', '', '', '', x.date, x.start, x.staffId, x.serviceId, x.client, x.createdAt])
  ]
  const rows = [CSV_HEADER, ...sourceRows.map((row) => row.map(csv).join(','))]
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `capacity-map-${today()}.csv`; link.click(); URL.revokeObjectURL(link.href); message = 'CSV downloaded'; render()
}
function parseCsv(input: string) {
  const lines = input.trim().split(/\r?\n/)
  const parse = (line: string) => {
    const out: string[] = []; let current = ''; let quote = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"' && quote && line[i + 1] === '"') { current += '"'; i++ } else if (char === '"') quote = !quote
      else if (char === ',' && !quote) { out.push(current); current = '' } else current += char
    }
    if (quote) throw new Error('A CSV row has an unclosed quote. Nothing was imported.')
    out.push(current)
    return out
  }
  const headers = parse(lines.shift() ?? '')
  if (headers.join(',') !== CSV_HEADER) throw new Error('This does not look like a Capacity Map CSV.')
  return lines.filter((line) => line.trim()).map((line) => {
    const values = parse(line)
    if (values.length > headers.length) throw new Error('A CSV row has more columns than expected. Nothing was imported.')
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])) as Record<string, string>
  })
}

function checkedCsvData(rows: Record<string, string>[]): Data {
  const next = emptyData()
  const list = (value: string) => value ? value.split('|').filter(Boolean) : []
  const integer = (value: string, label: string, minimum: number, maximum?: number) => {
    const parsed = Number(value)
    if (!Number.isInteger(parsed) || parsed < minimum || (maximum !== undefined && parsed > maximum)) throw new Error(`${label} must be a whole number from ${minimum}${maximum === undefined ? ' or more' : ` to ${maximum}`}. Nothing was imported.`)
    return parsed
  }
  const ids = new Set<string>()
  for (const row of rows) {
    if (!row.type || !row.id) throw new Error('One or more CSV rows is missing its type or ID. Nothing was imported.')
    if (!CSV_TYPES.has(row.type)) throw new Error(`Unsupported CSV row type “${row.type}”. Nothing was imported.`)
    const identity = `${row.type}:${row.id}`
    if (ids.has(identity)) throw new Error(`The CSV repeats ${row.type} ID “${row.id}”. Nothing was imported.`)
    ids.add(identity)
    if (row.type === 'staff') {
      if (!row.name) throw new Error('Each team member needs a name. Nothing was imported.')
      next.staff.push({ id: row.id, name: row.name, color: row.color || colours[0], parallelSlots: integer(row.parallelSlots, 'Parallel jobs', 1, 5) })
    } else if (row.type === 'resource') {
      if (!row.name) throw new Error('Each shared resource needs a name. Nothing was imported.')
      next.resources.push({ id: row.id, name: row.name, color: row.color || colours[1], capacity: integer(row.capacity, 'Resource units', 1, 20) })
    } else if (row.type === 'service') {
      if (!row.name || !list(row.staffIds).length) throw new Error('Each service needs a name and at least one team member. Nothing was imported.')
      next.services.push({ id: row.id, name: row.name, color: row.color || colours[2], minutes: integer(row.minutes, 'Service minutes', 5), staffIds: list(row.staffIds), resourceIds: list(row.resourceIds) })
    } else if (row.type === 'rule') {
      if (!row.serviceA || !row.serviceB || row.serviceA === row.serviceB || !['true', 'false'].includes(row.allowed)) throw new Error('Each service-pair rule needs two different services and a true or false setting. Nothing was imported.')
      next.rules.push({ id: row.id, serviceA: row.serviceA, serviceB: row.serviceB, allowed: row.allowed === 'true', note: row.note })
    } else {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(row.start) || !row.staffId || !row.serviceId) throw new Error('Each job needs a valid date, time, person, and service. Nothing was imported.')
      next.bookings.push({ id: row.id, date: row.date, start: row.start, minutes: integer(row.minutes, 'Job minutes', 5), staffId: row.staffId, serviceId: row.serviceId, resourceIds: list(row.resourceIds), client: row.client, createdAt: integer(row.createdAt, 'Job creation time', 0) })
    }
  }
  const staffIds = new Set(next.staff.map((item) => item.id)); const resourceIds = new Set(next.resources.map((item) => item.id)); const serviceIds = new Set(next.services.map((item) => item.id))
  if (next.services.some((item) => item.staffIds.some((value) => !staffIds.has(value)) || item.resourceIds.some((value) => !resourceIds.has(value)))) throw new Error('A service refers to a person or resource that is not in this CSV. Nothing was imported.')
  if (next.rules.some((item) => !serviceIds.has(item.serviceA) || !serviceIds.has(item.serviceB))) throw new Error('A service-pair rule refers to a service that is not in this CSV. Nothing was imported.')
  if (next.bookings.some((item) => !staffIds.has(item.staffId) || !serviceIds.has(item.serviceId) || item.resourceIds.some((value) => !resourceIds.has(value)))) throw new Error('A job refers to a person, service, or resource that is not in this CSV. Nothing was imported.')
  return next
}

async function importCsv(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const next = checkedCsvData(parseCsv(await file.text()))
    data = next; importError = ''; await persist('CSV imported into this device')
  } catch (error) {
    importError = error instanceof Error ? error.message : 'The CSV could not be imported.'; render()
  }
}

type LicenseCheck = { valid: boolean; at: number; token?: string }
function savedLicenseCheck(key: string): LicenseCheck | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? 'null') as LicenseCheck | null
    return value && typeof value.valid === 'boolean' && Number.isFinite(value.at) ? value : null
  } catch { return null }
}
async function activateLicense(token: string) {
  localStorage.setItem(`sb_license:${PRODUCT}`, token)
  const key = `sb_license_check:${PRODUCT}`; const old = savedLicenseCheck(key); const sameToken = !old?.token || old.token === token
  licensed = sameToken ? old?.valid ?? true : true
  if (old && sameToken && Date.now() - old.at < LICENSE_CHECK_MS) { render(); return }
  const startedAt = Date.now()
  localStorage.setItem(key, JSON.stringify({ valid: licensed, at: startedAt, token }))
  message = 'License restored — checking it quietly in the background.'; render()
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${PRODUCT}/verify?license=${encodeURIComponent(token)}`)
    if (!response.ok) throw new Error('License check unavailable')
    const verdict = await response.json() as { valid: boolean }
    localStorage.setItem(key, JSON.stringify({ valid: verdict.valid, at: startedAt, token }))
    licensed = verdict.valid
    message = verdict.valid ? '' : 'This license is no longer active. Your local plan is unchanged.'
    render()
  } catch { /* The attempt timestamp prevents reload loops; the cached verdict stays in force until tomorrow. */ }
}
function setupLicense() { if (demoMode) { licensed = true; return } licensed = false; const params = new URLSearchParams(location.search); const fromUrl = params.get('license'); const token = fromUrl || localStorage.getItem(`sb_license:${PRODUCT}`); if (fromUrl) { localStorage.setItem(`sb_license:${PRODUCT}`, fromUrl); params.delete('license'); history.replaceState({}, '', `${location.pathname}${params.toString() ? `?${params}` : ''}${location.hash}`) } if (token) void activateLicense(token) }

window.addEventListener('online', () => render()); window.addEventListener('offline', () => render())
window.addEventListener('popstate', () => {
  void routeTo(location.pathname as AppRoute, true)
})
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').then((registration) => {
  const showUpdate = (worker: ServiceWorker | null) => { if (worker && navigator.serviceWorker.controller) { updateWaiting = worker; render() } }
  showUpdate(registration.waiting)
  registration.addEventListener('updatefound', () => {
    const installing = registration.installing
    installing?.addEventListener('statechange', () => { if (installing.state === 'installed') showUpdate(installing) })
  })
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (updateWaiting) location.reload() })
}).catch(() => undefined))
load(storageMode()).then(async (loaded) => {
  data = loaded
  if (demoMode && !hasPlan(data)) { data = seededData(day); await save(data, 'demo') }
  setupLicense()
  if (initialUrl.searchParams.get('demo') === '1') { page = 'board'; history.replaceState({}, '', '/demo') }
  render()
}).catch(() => { message = 'Local storage is unavailable. Check your browser privacy settings.'; render() })
