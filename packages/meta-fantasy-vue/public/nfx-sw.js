const cacheName = 'nfx-<% CACHE_KEY %>'
const filesToCache = Object.values({
  ...{ html: 'index.html', root: '/' },
  ...JSON.parse('<% FILES_TO_CACHE %>')
}).filter(item => item !== 'robot.txt')

self.addEventListener('install', event => {
  // Perform install steps
  self.skipWaiting()

  console.log('[Servicework] Install')
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching app shell')
      return cache.addAll(filesToCache)
    })
  )
})

self.addEventListener('activate', event => {
  console.log('[Servicework] Activate')
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          console.log(key, cacheName)
          if (key !== cacheName) {
            console.log('[ServiceWorker] Removing old cache shell', key)
            return caches.delete(key)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', event => {
  if (event.request.method === 'GET') {
    console.log('[ServiceWorker] Fetch')
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request)
      })
    )
  }
})
