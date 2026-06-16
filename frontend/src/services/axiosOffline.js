// src/services/axiosOffline.js - VERSÃO CORRIGIDA COM GET OFFLINE

import axios from 'axios';
import { saveOfflineRequest, syncOfflineRequests, getPendingRequests, clearOldOfflineRequests as clearRequests } from './offlineManager';

export const API_BASE = 'http://localhost:8000/api';

// URLs que NUNCA devem ser salvas offline
const IGNORE_URLS = ['/login/', '/logout/', '/token/', '/auth/'];

// Criar instância do axios
export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// 🔥 FUNÇÃO PARA BUSCAR DO CACHE DO SERVICE WORKER
// ============================================
async function getFromSWCache(url) {
  // Verifica se o navegador suporta Cache API
  if (!('caches' in window)) {
    console.log('❌ Cache API não suportada');
    return null;
  }
  
  try {
    console.log(`🔍 Procurando no cache SW: ${url}`);
    
    // Pega todas as caches
    const cacheNames = await caches.keys();
    
    // Procura em cada cache
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(url);
      
      if (cachedResponse && cachedResponse.ok) {
        const data = await cachedResponse.json();
        console.log(`✅ ENCONTRADO no cache "${cacheName}": ${url}`);
        return data;
      }
    }
    
    console.log(`❌ NÃO encontrado em nenhum cache: ${url}`);
    return null;
    
  } catch (error) {
    console.error('❌ Erro ao buscar no cache:', error);
    return null;
  }
}

// ============================================
// INTERCEPTOR DE RESPOSTA - OFFLINE COMPLETO
// ============================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }
    
    // VERIFICAR se é uma URL que deve ser ignorada
    const shouldIgnore = IGNORE_URLS.some(ignoreUrl => 
      originalRequest.url?.includes(ignoreUrl)
    );
    
    if (shouldIgnore) {
      console.log(`🚫 Ignorando salvamento offline para: ${originalRequest.url}`);
      return Promise.reject(error);
    }
    
    // 🔥🔥🔥 SE FOR GET - TENTA O CACHE DO SERVICE WORKER 🔥🔥🔥
    if (originalRequest.method?.toLowerCase() === 'get') {
      console.log(`🔍 GET falhou, tentando cache do SW: ${originalRequest.url}`);
      console.log(`   Motivo: ${error.message}`);
      
      const cachedData = await getFromSWCache(originalRequest.url);
      
      if (cachedData) {
        console.log(`✅ Dados recuperados do cache SW para: ${originalRequest.url}`);
        return Promise.resolve({
          data: cachedData,
          fromSWCache: true,
          offline: true,
          message: 'Modo offline - dados do cache'
        });
      }
      
      // Sem cache, retorna dados vazios (não quebra o app)
      console.log(`⚠️ Sem cache disponível para: ${originalRequest.url}`);
      return Promise.resolve({
        data: {
          offline: true,
          data: [],
          message: 'Modo offline. Conecte-se à internet para carregar os dados.'
        },
        fromSWCache: false,
        offline: true
      });
    }
    
    // SE O BACKEND RESPONDEU -> NÃO SALVA OFFLINE
    if (error.response) {
      console.log(`❌ Backend respondeu com erro ${error.response.status}: ${originalRequest.url}`);
      return Promise.reject(error);
    }
    
    const methodsToSave = ['post', 'put', 'patch', 'delete'];
    const isWriteMethod = methodsToSave.includes(originalRequest.method?.toLowerCase());
    
    const isOffline = !navigator.onLine;
    const isNetworkError = error.code === 'ERR_NETWORK' || 
                          error.code === 'ECONNABORTED' ||
                          error.message === 'Network Error';
    
    // Só salva se for erro de rede E for método de escrita
    if ((isOffline || isNetworkError) && isWriteMethod && !originalRequest._isOfflineSaved) {
      console.log('📱 Offline - salvando requisição:', originalRequest.method, originalRequest.url);
      
      originalRequest._isOfflineSaved = true;
      
      await saveOfflineRequest({
        url: `${API_BASE}${originalRequest.url}`,
        method: originalRequest.method,
        headers: originalRequest.headers,
        data: originalRequest.data
      });
      
      return Promise.resolve({
        data: {
          offline: true,
          saved: true,
          message: 'Dados salvos offline. Serão enviados quando a internet voltar.'
        },
        status: 202,
        offline: true
      });
    }
    
    return Promise.reject(error);
  }
);

// Exportar funções auxiliares
export const syncOffline = syncOfflineRequests;
export const getOfflineStatus = getPendingRequests;
export const clearOldOfflineRequests = clearRequests;

export default api;