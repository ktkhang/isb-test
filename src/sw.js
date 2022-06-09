const PRECACHE = 'isb-precche';

const RUNTIME_CACHE = 'isb-runtime-cache';

const precacheResources = [
	'/static/images/author1.webp',
	'/static/images/author2.webp',
	'/static/images/author3.webp',
	'/static/images/author4.webp',
	'/static/images/avatar1.webp',
	'/static/images/avatar2.webp',
	'/static/images/avatar3.webp',
	'/static/images/building1.webp',
	'/static/images/building2.webp',
	'/static/images/building3.webp',
	'/static/images/building4.webp',
	'/static/images/building5.webp',
	'/static/images/building6.webp',
	'/static/images/bedroom.webp',
	'/static/images/cozy-houses.webp',
	'/static/images/luxury-houses.webp',
	'/static/images/studio-apartments.webp',
	'/static/images/swimming-pool.webp',
	'/static/images/slide1.webp',
	'/static/images/slide2.webp',
	'/static/images/slide3.webp',
];

// self.addEventListener('activate', event => {
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames.map(cacheName => caches.delete(cacheName))
//       );
//     })
//   );
// });

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(PRECACHE).then((cache) => cache.addAll(precacheResources))
	);
});

self.addEventListener('fetch', async (event) => {
	if (!(event.request.url.indexOf('http') === 0)) return;

	event.respondWith(
		caches
			.match(event.request)
			.then(
				(cacheRes) =>
					cacheRes ||
					fetch(event.request).then((fetchRes) =>
						caches.open(RUNTIME_CACHE).then((cache) => {
							cache.put(event.request.url, fetchRes.clone());
							// check cached items size
							limitCacheSize(RUNTIME_CACHE, 75);
							return fetchRes;
						})
					)
			)
			.catch(() => caches.match('/fallback'))
	);
});

const limitCacheSize = (name, size) => {
	caches.open(name).then((cache) => {
		cache.keys().then((keys) => {
			if (keys.length > size) {
				cache.delete(keys[0]).then(limitCacheSize(name, size));
			}
		});
	});
};
