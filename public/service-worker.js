self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open('ecommerce-cache-v2').then(cache => {
      return cache.addAll([
        '/ecommerce/',
        '/ecommerce/index.html',
        '/ecommerce/manifest.json',
        '/ecommerce/assets/main-*.js',
        '/ecommerce/assets/main-*.css',
        '/ecommerce/vite.svg'
      ]);
    })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== 'ecommerce-cache-v2') {
            console.log('Service Worker clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        // Don't cache API calls
        if (!event.request.url.includes('/api/')) {
          return caches.open('ecommerce-cache-v2').then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      // Fallback for HTML
      if (event.request.headers.get('accept').includes('text/html')) {
        return caches.match('/ecommerce/index.html');
      }
    })
  );
});