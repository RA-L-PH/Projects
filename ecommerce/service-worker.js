// Service Worker for ShopEasy ecommerce app
const CACHE_NAME = 'shopeasy-cache-v2';
const urlsToCache = [
  '/ecommerce/',
  '/ecommerce/index.html',
  '/ecommerce/vite.svg',
  '/ecommerce/manifest.json',
  '/ecommerce/404.html',
  // Include assets directory where Vite outputs compiled files
  '/ecommerce/assets/'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache)
          .catch(error => {
            console.error('Failed to cache URLs:', error);
            // Continue with installation even if some assets fail to cache
            return Promise.resolve();
          });
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Don't cache if it's not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and it can only be consumed once.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(error => {
          console.error('Fetch failed:', error);
          // Optionally return a fallback response or an error page
          return caches.match('/ecommerce/404.html');
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheAllowlist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});