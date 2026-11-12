/* BLACKOUT — 오프라인 지원 서비스 워커
   앱 파일을 미리 저장해 두어 인터넷이 끊겨도 앱이 열리게 합니다.
   앱 파일을 고치면 아래 CACHE 버전 숫자를 올려 주세요(그래야 설치된 앱도 새 버전을 받습니다). */
const CACHE = 'blackout-v2';

// 반드시 저장해야 하는 앱 파일 (하나라도 실패하면 설치를 다시 시도)
const CORE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'css/responsive.css',
  'css/print.css',
  'js/storage.js',
  'js/products.js',
  'js/disaster.js',
  'js/cart.js',
  'js/test.js',
  'js/shelter.js',
  'js/offline-card.js',
  'js/make-kit.js',
  'js/hero.js',
  'js/main.js',
  'assets/icons/favicon.svg',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/apple-touch-icon.png',
  'assets/images/hero.jpg',
  'assets/images/cta.jpg',
  'assets/images/problem-ai.jpg',
  'assets/images/problem-network.jpg',
  'assets/images/problem-unprepared.jpg',
  'assets/images/kit-72h.jpg',
  'assets/images/kit-blackout.jpg',
  'assets/images/kit-earthquake.jpg',
  'assets/images/kit-fire.jpg',
  'assets/images/kit-firstaid.jpg',
  'assets/images/kit-flood.jpg',
  'assets/images/kit-solo.jpg'
];

// 외부 라이브러리·글꼴 (가능하면 저장, 실패해도 설치는 진행)
const EXTRA = [
  'https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap',
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css'
];

// 한 번 받으면 저장해 두는 외부 주소 (글꼴 파일, 라이브러리, 지도 타일)
const CACHEABLE_HOSTS = ['unpkg.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com', 'tile.openstreetmap.org'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.all(EXTRA.map((url) =>
      cache.add(new Request(url, { mode: 'cors' })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('blackout-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 페이지 열기: 인터넷이 되면 최신 화면, 끊기면 저장된 화면
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('index.html', fresh.clone());
        return fresh;
      } catch {
        return (await caches.match('index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }

  // 앱 파일: 저장된 것을 바로 보여 주고, 뒤에서 최신으로 갱신
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req, { ignoreSearch: true });
      const update = fetch(req).then((res) => {
        if (res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || update;
    })());
    return;
  }

  // 외부 라이브러리·글꼴·지도 타일: 저장된 게 있으면 그것을, 없으면 받아서 저장
  if (CACHEABLE_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith('.' + h))) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
      return res;
    })());
  }
  // 그 밖의 요청(대피소 검색 등)은 그대로 인터넷으로 보냅니다.
});
