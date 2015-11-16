'use strict';

const OFFLINE_CACHE = 'chernihivjs_offline';
const URLS_CACHE = [
  '/',
  '/styles.css'
];

const isOnline = () => self.navigator.onLine;

self.addEventListener('install', (event) => {

  event.waitUntil(caches.open(OFFLINE_CACHE)
    .then((cache) => cache.addAll(URLS_CACHE)));
});

self.addEventListener('fetch', (event) => {

  event.respondWith(caches.match(event.request)
    .then((response) => {

      if (response) {

        return response;
      }

      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((res) => {

          if (!res || res.status !== 200 || res.type !== 'basic') {

            return res;
          }

          caches.open(OFFLINE_CACHE)
            .then((cache) => cache.put(event.request, res.clone()));

          return res;
        });
    }));
});
