import { defineConfig, type Plugin } from 'vite'

function capacityServiceWorker(): Plugin {
  return {
    name: 'capacity-service-worker',
    apply: 'build',
    generateBundle(_, bundle) {
      const files = Object.values(bundle)
        .filter((item) => item.type === 'chunk' || item.type === 'asset')
        .map((item) => `/${item.fileName}`)
      const precache = JSON.stringify(['/', '/offline.html', '/manifest.webmanifest', ...files])
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: `const CACHE='capacity-map-v1';const PRECACHE=${precache};self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const url=new URL(e.request.url);if(url.origin!==location.origin)return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>e.request.mode==='navigate'?caches.match('/offline.html'):new Response('',{status:503}))))})`
      })
    }
  }
}

export default defineConfig({
  build: { target: 'es2022', manifest: false, cssCodeSplit: true },
  plugins: [capacityServiceWorker()]
})
