/*
 * Service worker: офлайн-режим для установленного приложения.
 * Стратегия: сначала кеш, затем сеть; новые файлы докладываются в кеш.
 *
 * ВАЖНО: при обновлении файлов приложения поднимайте версию кеша ниже,
 * иначе браузер продолжит отдавать старую копию.
 */
const CACHE = 'samogon-v2';
const PRECACHE = [
  './',
  './index.html',
  './support.html',
  './assets/style.css',
  './assets/calc.js',
  './assets/i18n.js',
  './assets/i18n.de.js',
  './assets/i18n.es.js',
  './assets/app.js',
  './assets/analytics.js',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
