// Service Worker for ShopEasy ecommerce app
const CACHE_NAME = 'shopeasy-cache-v3';
const urlsToCache = [
  '/ecommerce/',
  '/ecommerce/index.html',
  '/ecommerce/vite.svg',
  '/ecommerce/manifest.json',
  '/ecommerce/404.html',
  // Cache the assets directory with compiled JS and CSS
  '/ecommerce/assets/'
];

// Function to individually cache items to prevent all-or-nothing failures
async function cacheResources(cache) {
  const failedUrls = [];
  
  for (const url of urlsToCache) {
    try {
      // For directory entries like '/ecommerce/assets/', we skip them
      // as fetch() can't directly fetch a directory
      if (url.endsWith('/')) continue;
      
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
        console.log(`Cached: ${url}`);
      } else {
        failedUrls.push(`${url} - Status: ${response.status}`);
      }
    } catch (error) {
      failedUrls.push(`${url} - Error: ${error.message}`);
    }
  }
  
  if (failedUrls.length > 0) {
    console.warn('Some URLs failed to cache:', failedUrls);
  }
  
  return Promise.resolve();
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use our custom function instead of cache.addAll
        return cacheResources(cache);
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