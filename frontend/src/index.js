// src/index.js - VERSÃO COM PRÉ-CACHE DE APIS
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { initOfflineDB, clearOldOfflineRequests } from './services/offlineManager';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ATIVAR SERVICE WORKER (PWA)
serviceWorkerRegistration.register();

// INICIALIZAR OFFLINE DB
initOfflineDB().then(() => {
  console.log('✅ Offline DB pronto');
  clearOldOfflineRequests(30);
});

// 🔥 FORÇAR CACHE DAS APIS QUANDO A PÁGINA CARREGAR
window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator && navigator.onLine) {
    console.log('🔄 Forçando pré-cache das APIs...');
    
    const CACHE_NAME = 'laco-favela-v1';
    const apisParaCachear = [
      '/api/ciclos',
      '/api/familias',
      '/api/presidentes',
      '/api/admin/dashboard/cotas/'
    ];
    
    try {
      const cache = await caches.open(CACHE_NAME);
      
      for (const api of apisParaCachear) {
        try {
          const response = await fetch(api, { 
            headers: { 'Cache-Control': 'no-cache' }
          });
          if (response.ok) {
            await cache.put(api, response);
            console.log(`✅ API cacheada: ${api}`);
          } else {
            console.log(`⚠️ API ${api} retornou status ${response.status}`);
          }
        } catch (error) {
          console.log(`❌ Falha ao cachear: ${api}`, error);
        }
      }
      
      console.log('🎉 Pré-cache das APIs concluído!');
    } catch (error) {
      console.error('❌ Erro ao abrir cache:', error);
    }
  }
});

// Sincronizar quando voltar online (sem loop)
let isSyncing = false;

window.addEventListener('online', async () => {
  if (isSyncing) return;
  isSyncing = true;
  
  console.log('🟢 Internet conectada!');
  
  const { syncOfflineRequests, getPendingRequests } = await import('./services/offlineManager');
  const pending = await getPendingRequests();
  
  if (pending.length > 0) {
    console.log(`📱 ${pending.length} ações pendentes. Sincronizando...`);
    const result = await syncOfflineRequests();
    if (result.success > 0) {
      console.log('✅ Sincronização concluída!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
  
  isSyncing = false;
});