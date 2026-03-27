const CACHE_NAME = 'smattire-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/shop.html',
    '/about.html',
    '/contact.html',
    '/app.js',
    '/styles.css',
    '/manifest.webmanifest',
    '/icon-192.png',
    '/icon-512.png',
    '/sera.jpg',
    '/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg', '/6.jpg', '/7.jpg',
    '/8.jpg', '/9.jpg', '/10.jpg', '/11.jpg', '/12.jpg', '/13.jpg', '/14.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Network-first for API/functions
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/')) {
        event.respondWith(
            fetch(request).catch(() => new Response(JSON.stringify({ error: 'Offline' }), {
                headers: { 'Content-Type': 'application/json' }
            }))
        );
        return;
    }

    // Cache-first for static assets
    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) return cached;
            return fetch(request).then(response => {
                if (!response || response.status !== 200 || response.type === 'opaque') return response;
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                return response;
            }).catch(() => {
                if (request.destination === 'document') {
                    return caches.match('/index.html');
                }
                return new Response('', { status: 404 });
            });
        })
    );
});
