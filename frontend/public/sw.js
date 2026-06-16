// public/sw.js - VERSÃO DEFINITIVA CORRIGIDA

const CACHE_NAME = 'laco-favela-v3';
const DYNAMIC_CACHE = 'laco-favela-dynamic-v3';

const STATIC_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

// ============================================
// INSTALL
// ============================================
self.addEventListener('install', (event) => {
  console.log('🔧 SW: Instalando...');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(STATIC_URLS);
      console.log('✅ Arquivos estáticos cacheados');
      
      try {
        const manifestRes = await fetch('/asset-manifest.json');
        if (manifestRes.ok) {
          const manifest = await manifestRes.json();
          const buildFiles = Object.values(manifest.files);
          await cache.addAll(buildFiles);
          console.log(`✅ ${buildFiles.length} build files cacheados`);
        }
      } catch (err) {
        console.log('⚠️ Build files serão cacheados depois');
      }
    })()
  );
  
  self.skipWaiting();
});

// ============================================
// ACTIVATE
// ============================================
self.addEventListener('activate', (event) => {
  console.log('🚀 SW: Ativando...');
  
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME && name !== DYNAMIC_CACHE) {
            console.log('🗑️ Removendo cache:', name);
            return caches.delete(name);
          }
        })
      );
      
      await self.clients.claim();
      console.log('✅ SW ativado');
      
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({ type: 'SW_ACTIVATED' });
      });
    })()
  );
});

// ============================================
// FETCH CORRIGIDO
// ============================================
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const request = event.request;
  
  // Só cacheia GET
  if (request.method !== 'GET') {
    event.respondWith(fetch(request));
    return;
  }
  
  // Ignora analytics
  if (url.pathname.includes('/analytics') || url.pathname.includes('__webpack')) {
    event.respondWith(fetch(request));
    return;
  }
  
  event.respondWith(
    (async () => {
      const isOnline = navigator.onLine;
      
      // Se está offline, vai direto ao cache
      if (!isOnline) {
        console.log('📱 Offline, buscando cache:', url.pathname);
        const cached = await getFromCache(request);
        if (cached) return cached;
        
        // Fallback para API
        if (url.pathname.startsWith('/api/')) {
          return new Response(
            JSON.stringify({ offline: true, data: [], message: 'Modo offline' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        // Fallback para navegação
        if (request.mode === 'navigate') {
          const index = await caches.match('/index.html');
          if (index) return index;
        }
        
        return new Response('Offline', { status: 503 });
      }
      
      // Está online, tenta rede
      try {
        console.log('📡 Rede:', url.pathname);
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.ok) {
          // Salva no cache apropriado
          const cacheName = url.pathname.startsWith('/api/') ? DYNAMIC_CACHE : CACHE_NAME;
          const cache = await caches.open(cacheName);
          cache.put(request, networkResponse.clone());
          console.log('💾 Cacheado em:', cacheName, url.pathname);
        }
        return networkResponse;
        
      } catch (error) {
        // Erro de rede, tenta cache
        console.log('📡 Erro rede, tentando cache:', url.pathname);
        const cached = await getFromCache(request);
        if (cached) return cached;
        
        // Fallback para API
        if (url.pathname.startsWith('/api/')) {
          return new Response(
            JSON.stringify({ offline: true, data: [], message: 'Sem dados em cache' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response('Não disponível offline', { status: 503 });
      }
    })()
  );
});

// ============================================
// FUNÇÃO AUXILIAR
// ============================================
async function getFromCache(request) {
  const dynamicCache = await caches.open(DYNAMIC_CACHE);
  let cached = await dynamicCache.match(request);
  if (cached) return cached;
  
  const staticCache = await caches.open(CACHE_NAME);
  cached = await staticCache.match(request);
  return cached;
}

// ============================================
// MENSAGENS
// ============================================
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (type === 'CACHE_API_DATA' && payload) {
    (async () => {
      const cache = await caches.open(DYNAMIC_CACHE);
      const response = new Response(JSON.stringify(payload.data), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put(payload.url, response);
      console.log('✅ API cacheada manualmente:', payload.url);
    })();
  }
});