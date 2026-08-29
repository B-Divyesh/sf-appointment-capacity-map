import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function channel(value: number) {
  const fraction = value / 255
  return fraction <= 0.04045 ? fraction / 12.92 : ((fraction + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string) {
  const [red, green, blue] = hex.slice(1).match(/../g)!.map((value) => channel(Number.parseInt(value, 16)))
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrast(first: string, second: string) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

describe('release contracts', () => {
  it('lists every claim with one matching browser regression', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as { id: string; test: string }[]
    const browserTests = readFileSync('e2e/claims.spec.ts', 'utf8')
    expect(claims.length).toBeGreaterThan(0)
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length)
    for (const claim of claims) {
      const tag = `@claim:${claim.id}`
      expect(browserTests.split(tag)).toHaveLength(2)
      expect(claim.test).toContain(`--grep ${tag}`)
    }
  })

  it('ships CSP, immutable assets, manifest MIME, and a real 404 response', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'))
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'")
    expect(config.globalHeaders['Content-Security-Policy']).toContain('https://api.sociobot.in')
    expect(config.routes.find((route: { route: string }) => route.route === '/assets/*').headers['Cache-Control']).toContain('immutable')
    expect(config.routes.find((route: { route: string }) => route.route === '/manifest.webmanifest').headers['Content-Type']).toContain('application/manifest+json')
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 })
    for (const route of ['/setup', '/review', '/demo', '/demo/*', '/privacy', '/terms']) {
      expect(config.routes.find((entry: { route: string }) => entry.route === route)?.rewrite).toBe('/index.html')
    }
    const notFound = readFileSync('public/404.html', 'utf8')
    for (const required of ['<header>', '<main', '<footer>', 'name="description"', 'property="og:description"', 'name="twitter:description"', 'href="/privacy"', 'href="/terms"', 'rel="icon"']) expect(notFound).toContain(required)
  })

  it('lists every public application route in the sitemap', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8')
    for (const route of ['/', '/demo', '/demo/setup', '/demo/review', '/setup', '/review', '/privacy', '/terms']) {
      expect(sitemap).toContain(`<loc>https://appointment-capacity-map.sociobot.in${route}</loc>`)
    }
  })

  it('keeps the generated-art disclosure in every public footer', () => {
    const app = readFileSync('src/main.ts', 'utf8')
    const notFound = readFileSync('public/404.html', 'utf8')
    const disclosure = 'Notebook art was generated for Capacity Map.'
    expect(app).toContain(disclosure)
    expect(notFound).toContain(disclosure)
  })

  it('uses one public term for team members, shared resources, and service-pair rules', () => {
    const app = readFileSync('src/main.ts', 'utf8')
    const readme = readFileSync('README.md', 'utf8')
    const publicCopy = `${app}\n${readme}`.replace(/\s+/g, ' ')
    for (const copy of [
      'Record team members, services, shared resources, and service-pair rules.',
      'Each blocked slot names the team member, shared resource, or service-pair rule.',
      'The planner records team members, services, shared resources, and service-pair rules.',
      'Check team-member, shared-resource, and service-pair conflicts with a plain explanation.'
    ]) expect(publicCopy).toContain(copy)
  })

  it('declares third-party font and script privacy in the claim contract', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as { id: string; claim: string; sandbox: string }[]
    const privacy = claims.find((claim) => claim.id === 'privacy-local-only')
    expect(privacy?.claim).toContain('third-party fonts or scripts')
    expect(privacy?.sandbox).toContain('script, stylesheet, and font')
  })

  it('derives the PWA cache and installed URL from the same build version', () => {
    const config = readFileSync('vite.config.ts', 'utf8')
    expect(config).not.toContain("capacity-map-v1")
    expect(config).not.toContain("start_url: '/?v=1'")
    expect(config).toContain("const CACHE='capacity-map-'+VERSION")
    expect(config).toContain('start_url: `/?v=${version}`')
    expect(config).toContain("createHash('sha256')")
  })

  it('keeps small warning and danger text at 4.5:1 contrast on paper', () => {
    const styles = readFileSync('src/styles.css', 'utf8')
    const token = (name: string) => styles.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1] ?? ''
    expect(contrast(token('red'), token('paper'))).toBeGreaterThanOrEqual(4.5)
    expect(contrast(token('ochre'), token('paper'))).toBeGreaterThanOrEqual(4.5)
  })
})
