const CACHE_NAME = 'ielts-tracker-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './logo.png'
];

self.addEventListener('install', event => {
  // Bắt buộc Service Worker mới kích hoạt ngay lập tức (bỏ qua trạng thái waiting)
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Xoá bộ nhớ đệm cũ khi có phiên bản Service Worker mới
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Yêu cầu các trang đang mở sử dụng ngay Service Worker mới
  event.waitUntil(self.clients.claim());
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
