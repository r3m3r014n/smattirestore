const CACHE_NAME = 'smattire-v3';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/shop.html',
    '/about.html',
    '/contact.html',
    '/app.js?v=20260328b',
    '/styles.css?v=20260328b',
    '/manifest.webmanifest',
    '/icon-192.png',
    '/icon-512.png',
    '/sera.jpg',
    '/oversized-flannel-shirt.jpg', '/retro-running-sneakers.jpg', '/classic-denim-jacket.jpg',
    '/high-top-canvas-shoes.jpg', '/premium-neatfit-jordans.jpg',
    '/y2k-baggy-jeans.jpg', '/vintage-windbreaker.jpg', '/chelsea-boots.jpg',
    '/casual-summer-shorts.jpg', '/slip-on-casual-vans.jpg',
    '/jacket-and-cap.jpg', '/cap-and-chanel-bag.jpg', '/nike-air-and-cap.jpg',
    '/cotton-sweaters.jpg', '/air-force-tee-cap.jpg', '/t-shirts.jpg', '/white-striped-shirts.jpg',
    '/pink-alo-tee-cap.jpg', '/shoes.jpg', '/pink-new-balance.jpg', '/white-new-balance.jpg',
    '/bag-cap-shoes.jpg', '/new-balance-9060.jpg', '/nike.jpg',
    '/sm-attire-logo.png', '/neatfit-logo.jpg', '/sm-attire-insta-page.jpg',
    '/sm_attire_-20260327-0001.mp4', '/sm_attire_-20260327-0001.jpg', '/sm_attire_-20260327-0002.jpg',
    '/Screenshot_20260327_235526_InstaGold.jpg', '/Screenshot_20260327_235533_InstaGold (1).jpg'
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
