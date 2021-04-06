// Consolidate assets to add to cache
const STATIC_CACHE = 'static-cache-v1';
const DATA_CACHE = 'data-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/dist/icon_192x192.png',
  '/dist/icon_512x512.png',
  '/dist/bundle.js',
  '/dist/manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
  'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
];

// Install static files into cache
self.addEventListener('install', (event) => {
  console.log('Installing static files...');

  // Pre-cache all static assets
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      cache.addAll(FILES_TO_CACHE);
      console.log('Static cache updated! 🍎');
    })
  );

  // Pre-cache all transaction data from API
  event.waitUntil(
    caches.open(DATA_CACHE).then((cache) => {
      cache.add('/api/transaction');
      console.log('Data cache updated! 🍎');
    })
  );

  // Activate the service worker as soon as installation is complete
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Gather all of the caches in storage
    caches.keys().then((allKeys) => {
      return Promise.all(
        allKeys.map((key) => {
          // If the current cache name is NOT in static cache
          if (key !== STATIC_CACHE && key !== DATA_CACHE) {
            // Remove the old cache
            console.log(`Deleting old cache data: ${key}`);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Allow service worker to intercept http requests over the network
self.addEventListener('fetch', (event) => {
  // If http request is directed at API
  if (event.request.url.includes('/api')) {
    console.log('[Service Worker] Fetching data: ' + event.request.url);

    event.respondWith(
      // Open the data cache
      caches.open(DATA_CACHE).then((cache) => {
        // Make a network request for the data
        return fetch(event.request)
          .then((res) => {
            // If the response is okay...
            if (res.status === 200) {
              // Put the request and the response into data cache
              cache.put(event.request.url, res.clone());
            }

            return res;
          })
          .catch((err) => {
            // If request fails, look for a response in data cache
            return cache.match(event.request);
          });
      })
    );

    return;
  }

  // Respond to the fetch event
  event.respondWith(
    // Look in the static cache for the requested asset
    caches.open(STATIC_CACHE).then((cache) => {
      // Look for the requested resource in cache
      return cache.match(event.request).then((res) => {
        // If the resource is in cache, serve it
        // If not, proceed with network request
        return res || fetch(event.request);
      });
    })
  );
});
