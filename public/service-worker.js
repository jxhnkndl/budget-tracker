// Specify application files to cache
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/dist/assets/icons/icon_192x192.png',
  '/dist/assets/icons/icon_512x512.png',
  '/dist/bundle.js',
  '/dist/manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
  'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
];

// install event handler
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('static').then( cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  console.log('Installing static files... 🐢');
  self.skipWaiting();
});

// retrieve assets from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then( response => {
      return response || fetch(event.request);
    })
  );
});
