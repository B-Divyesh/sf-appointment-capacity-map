import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

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
  })

  it('derives the PWA cache and installed URL from the same build version', () => {
    const config = readFileSync('vite.config.ts', 'utf8')
    expect(config).not.toContain("capacity-map-v1")
    expect(config).not.toContain("start_url: '/?v=1'")
    expect(config).toContain("const CACHE='capacity-map-'+VERSION")
    expect(config).toContain('start_url: `/?v=${version}`')
    expect(config).toContain("createHash('sha256')")
  })
})
