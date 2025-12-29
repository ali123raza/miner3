/**
 * Service Worker for CloudMiner PWA/TWA
 * Handles offline fallback and basic caching
 */

const CACHE_NAME = 'cloudminer-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache on install
const STATIC_CACHE = [
  OFFLINE_URL,
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

/**
 * Install Event - Cache offline page and essential assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching offline page and assets');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control immediately
  );
});

/**
 * Fetch Event - Network first, fallback to offline page on navigation
 */
self.addEventListener('fetch', (event) => {
  // Only handle navigation requests (page loads)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Network failed, serve offline page
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // For other requests (API, assets), try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response to cache it
        const responseToCache = response.clone();

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request);
      })
  );
});

/**
 * Message Event - Handle commands from the app
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        console.log('[Service Worker] All caches cleared');
      })
    );
  }
});

/**
 * Background Sync - Handle failed API requests (optional, future feature)
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[Service Worker] Background sync triggered');
    // Implement background sync logic here
  }
});

console.log('[Service Worker] Loaded successfully');
