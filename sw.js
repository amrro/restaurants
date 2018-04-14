// for like CSS, HTML...
const staticCacheName = 'restaurants-static';

// for images.
const contentImgsCache = 'restaurants-content-imgs';
const allCaches = [
    staticCacheName,
    contentImgsCache
];


self.addEventListener('install', function (event) {
    console.log('installed successfully');
    console.log('location');
    console.log(location);

    // caching all static files
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                '/',
                './css/styles.css',
                './js/dbhelper.js',
                './js/main.js',
                './js/restaurant_info.js',
                './index.html',
                './restaurant.html'
            ]);
        })
    );
});

self.addEventListener('activate', function (event) {
    console.log('Activated successfully...');


    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('restaurants-') &&
                        !allCaches.includes(cacheName);
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    const requestUrl = new URL(event.request.url);
    console.log(requestUrl);


    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            event.respondWith(caches.match('/'));
            return;
        }

       /* if (requestUrl.pathname.startsWith('/photos/')) {
            event.respondWith(servePhoto(event.request));
            return;
        }*/

    }

    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
