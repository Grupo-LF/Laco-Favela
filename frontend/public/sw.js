const CACHE_NAME = 'laco-favela-v1';

const ARQUIVOS_PARA_CACHEAR = [
    '/',
    '/index.html'
];

self.addEventListener('install', (evento) => {
    evento.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Instalando Service Worker - salvando arquivos no cache');
            return cache.addAll(ARQUIVOS_PARA_CACHEAR);
        })
    );
});

self.addEventListener('activate', (evento) => {
    console.log('Service Worker ativado');
    evento.waitUntil(
        caches.keys().then((nomesDosCaches) => {
            return Promise.all(
                nomesDosCaches.map((nomeDoCache) => {
                    if (nomeDoCache !== CACHE_NAME) {
                        console.log('Removendo cache antigo:', nomeDoCache);
                        return caches.delete(nomeDoCache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (evento) => {
    evento.respondWith(
        caches.match(evento.request).then((respostaDoCache) => {
            if (respostaDoCache) {
                return respostaDoCache;
            }
            return fetch(evento.request);
        })
    );
});