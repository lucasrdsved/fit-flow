// Enhanced Service Worker for FitFlow PWA
const CACHE_VERSION = '2.0.0';
const STATIC_CACHE = `fitflow-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `fitflow-dynamic-${CACHE_VERSION}`;
const API_CACHE = `fitflow-api-${CACHE_VERSION}`;
const IMAGE_CACHE = `fitflow-images-${CACHE_VERSION}`;

// Cache strategies
const CACHE_STRATEGIES = {
  STATIC: ['cacheFirst'],
  API: ['networkFirst', { cacheName: API_CACHE }],
  DYNAMIC: ['staleWhileRevalidate'],
  IMAGES: ['cacheFirst', { cacheName: IMAGE_CACHE }]
};

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/robots.txt',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Background sync queue
let syncQueue = [];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing enhanced service worker v' + CACHE_VERSION);
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Force activation
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating enhanced service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => 
            !cacheName.includes(CACHE_VERSION) && 
            cacheName.startsWith('fitflow-')
          )
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('[SW] Cache cleanup complete');
      return self.clients.claim();
    })
  );
});

// Cache strategy implementations
const cacheFirst = async (request, cacheName = DYNAMIC_CACHE) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Network request failed:', error);
    throw error;
  }
};

const networkFirst = async (request, cacheName = API_CACHE) => {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
};

const staleWhileRevalidate = async (request, cacheName = DYNAMIC_CACHE) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  return cached || fetchPromise;
};

// Fetch event - enhanced routing with strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different request types with appropriate strategies
  if (url.hostname.includes('supabase')) {
    // Supabase API requests - Network First
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (request.destination === 'image') {
    // Images - Cache First
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  if (url.origin === self.location.origin) {
    // Same-origin requests - Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    return;
  }

  // Default: try network first, fallback to cache
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Background Sync for workout data
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'workout-sync') {
    event.waitUntil(syncWorkoutData());
  }
  
  if (event.tag === 'auth-sync') {
    event.waitUntil(syncAuthData());
  }
});

async function syncWorkoutData() {
  try {
    // Get stored workout data from IndexedDB
    const workoutData = await getStoredWorkoutData();
    if (workoutData.length === 0) return;

    console.log('[SW] Syncing workout data:', workoutData.length, 'items');
    
    for (const data of workoutData) {
      try {
        const response = await fetch('/api/workouts/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          await removeStoredWorkoutData(data.id);
          console.log('[SW] Synced workout data:', data.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync workout data:', data.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

async function syncAuthData() {
  try {
    // Handle authentication data sync
    console.log('[SW] Syncing authentication data');
  } catch (error) {
    console.error('[SW] Auth sync failed:', error);
  }
}

// IndexedDB helpers for offline storage
async function getStoredWorkoutData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FitFlowOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const getAll = store.getAll();
      
      getAll.onsuccess = () => resolve(getAll.result);
      getAll.onerror = () => reject(getAll.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id' });
      }
    };
  });
}

async function removeStoredWorkoutData(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FitFlowOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve(deleteRequest.result);
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  const options = {
    body: 'Time for your workout!',
    icon: '/icons/workout-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'start',
        title: 'Start Workout',
        icon: '/icons/workout-96.png'
      },
      {
        action: 'snooze',
        title: 'Snooze 10 min',
        icon: '/icons/timer-192.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'FitFlow Reminder';
  }
  
  event.waitUntil(
    self.registration.showNotification(options.title || 'FitFlow', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  
  event.notification.close();
  
  if (event.action === 'start') {
    event.waitUntil(
      clients.openWindow('/student/workout?source=pwa')
    );
  } else if (event.action === 'snooze') {
    // Schedule another notification after 10 minutes
    event.waitUntil(
      self.registration.showNotification('Workout Reminder', {
        body: 'Time for your workout!',
        icon: '/icons/workout-192.png',
        badge: '/icons/badge-72.png',
        tag: 'workout-reminder',
        showTrigger: new Date(Date.now() + 10 * 60 * 1000)
      })
    );
  } else {
    // Default: open the app
    event.waitUntil(
      clients.matchAll().then(clientList => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Message event - handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  if (event.data && event.data.type === 'SYNC_WORKOUT') {
    // Queue workout data for sync
    syncQueue.push(event.data.workoutData);
    
    // Register for background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      event.waitUntil(self.registration.sync.register('workout-sync'));
    }
  }
});

// Periodic sync for data updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-workout-data') {
    event.waitUntil(updateWorkoutData());
  }
});

async function updateWorkoutData() {
  try {
    console.log('[SW] Periodic sync: updating workout data');
    // Implement periodic data updates
  } catch (error) {
    console.error('[SW] Periodic sync failed:', error);
  }
}
