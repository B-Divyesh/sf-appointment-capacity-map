import { execFileSync } from 'node:child_process'
import { defineConfig, type Plugin } from 'vite'

function buildVersion() {
  const fallback = `local-${Date.now().toString(36)}`
  try {
    const commit = execFileSync('git', ['rev-parse', '--short=12', 'HEAD'], { encoding: 'utf8' }).trim()
    execFileSync('git', ['diff', '--quiet'])
    return commit
  } catch {
    return fallback
  }
}

const version = process.env.VITE_BUILD_ID || buildVersion()

function capacityServiceWorker(): Plugin {
  return {
    name: 'capacity-service-worker',
    apply: 'build',
    generateBundle(_, bundle) {
      const files = Object.values(bundle)
        .filter((item) => item.type === 'chunk' || item.type === 'asset')
        .map((item) => `/${item.fileName}`)
      const precache = JSON.stringify([...new Set(['/', '/demo', '/privacy', '/terms', '/offline.html', '/manifest.webmanifest', ...files])])
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.webmanifest',
        source: JSON.stringify({
          id: '/',
          name: 'Capacity Map',
          short_name: 'Capacity Map',
          description: 'Check service job overlaps for small teams.',
          start_url: `/?v=${version}`,
          display: 'standalone',
          background_color: '#f7f0df',
          theme_color: '#f7f0df',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
          ]
        })
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: `const VERSION=${JSON.stringify(version)};const CACHE='capacity-map-'+VERSION;const PRECACHE=${precache};self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE))));self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('capacity-map-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(async()=>await caches.match(event.request,{ignoreSearch:true})||await caches.match('/')||await caches.match('/offline.html')));return}event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>new Response('',{status:503}))))})`
      })
    }
  }
}

export default defineConfig({
  build: { target: 'es2022', manifest: false, cssCodeSplit: true },
  define: { __BUILD_VERSION__: JSON.stringify(version) },
  plugins: [capacityServiceWorker()]
})
