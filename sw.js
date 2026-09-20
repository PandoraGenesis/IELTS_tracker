const CACHE_NAME = 'ielts-tracker-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Chỉ cache các file tĩnh của web (cùng tên miền) và phương thức GET
  // Bỏ qua các kết nối API, Firebase, Firestore để không gây lỗi đồng bộ
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return from cache
        }
        return fetch(event.request); // Fetch from network
      })
  );
});
