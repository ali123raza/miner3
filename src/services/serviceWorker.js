/**
 * Service Worker Registration
 * Registers the service worker for PWA/TWA offline support
 */

/**
 * Register service worker
 * @returns {Promise<ServiceWorkerRegistration|null>}
 */
export async function registerServiceWorker() {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported in this browser');
    return null;
  }

  try {
    // Register the service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('Service Worker registered successfully:', registration.scope);

    // Check for updates on page load
    registration.update();

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available, prompt user to refresh
          console.log('New version available! Refresh to update.');

          // Optionally show a notification to the user
          if (window.confirm('New version available! Refresh to update?')) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          }
        }
      });
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker (useful for debugging)
 * @returns {Promise<boolean>}
 */
export async function unregisterServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
      const unregistered = await registration.unregister();
      console.log('Service Worker unregistered:', unregistered);
      return unregistered;
    }

    return false;
  } catch (error) {
    console.error('Service Worker unregister failed:', error);
    return false;
  }
}

/**
 * Clear all caches
 * @returns {Promise<void>}
 */
export async function clearAllCaches() {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();

    await Promise.all(
      cacheNames.map((cacheName) => caches.delete(cacheName))
    );

    console.log('All caches cleared');
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
}

/**
 * Check if app is running in TWA
 * @returns {boolean}
 */
export function isTWA() {
  // Check if running in standalone mode (TWA or installed PWA)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // Check for TWA-specific user agent indicators
  const userAgent = navigator.userAgent || '';
  const isTWAUserAgent = userAgent.includes('wv') || // WebView indicator
                         document.referrer.includes('android-app://');

  return isStandalone || isTWAUserAgent;
}

/**
 * Check if user is online
 * @returns {boolean}
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Listen for online/offline events
 * @param {Function} onOnline - Callback when connection is restored
 * @param {Function} onOffline - Callback when connection is lost
 * @returns {Function} cleanup function to remove listeners
 */
export function watchConnectionStatus(onOnline, onOffline) {
  const handleOnline = () => {
    console.log('Connection restored');
    if (onOnline) onOnline();
  };

  const handleOffline = () => {
    console.log('Connection lost');
    if (onOffline) onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Request persistent storage (optional, for large caches)
 * @returns {Promise<boolean>}
 */
export async function requestPersistentStorage() {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    try {
      const isPersisted = await navigator.storage.persist();
      console.log(`Persistent storage ${isPersisted ? 'granted' : 'denied'}`);
      return isPersisted;
    } catch (error) {
      console.error('Failed to request persistent storage:', error);
      return false;
    }
  }

  return false;
}

/**
 * Get storage quota information
 * @returns {Promise<{usage: number, quota: number, percentage: number}|null>}
 */
export async function getStorageInfo() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return null;
    }
  }

  return null;
}
