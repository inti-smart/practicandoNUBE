// ============================================
//  HIDRATADOR ULTRA PRO - Service Worker
//  PWA Offline Support v7.0
// ============================================

const CACHE_NAME = 'hidratador-v7-0';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/styles.css',
    '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('⚙️ Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching app resources');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('❌ Cache failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }

                return fetch(event.request).then((response) => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                });
            })
            .catch(() => {
                // Offline fallback
                return caches.match('/index.html');
            })
    );
});

// Background sync for water tracking
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-water-data') {
        event.waitUntil(syncWaterData());
    }
});

async function syncWaterData() {
    console.log('🔄 Syncing water data...');
    // Future: sync with backend API
    return Promise.resolve();
}

// Push notifications for reminders
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || '💧 Hidratador';
    const options = {
        body: data.body || 'Es hora de hidratarte!',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'drink',
                title: 'Bebí agua',
                icon: '/check-icon.png'
            },
            {
                action: 'close',
                title: 'Cerrar'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'drink') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
