// src/services/offlineManager.js
let db = null;
const DB_NAME = 'laco-favela-offline';
const DB_VERSION = 1;
const STORE_NAME = 'pending-requests';

// Inicializar banco IndexedDB
export const initOfflineDB = () => {
  console.log('🔷 [initOfflineDB] Iniciando...');
  return new Promise((resolve, reject) => {
    if (db) {
      console.log('🔷 [initOfflineDB] Banco já existe, reutilizando');
      resolve(db);
      return;
    }
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => {
      console.error('❌ [initOfflineDB] Erro:', request.error);
      reject(request.error);
    };
    
    request.onsuccess = () => {
      db = request.result;
      console.log('✅ [initOfflineDB] Banco offline inicializado com sucesso!');
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      console.log('🔧 [initOfflineDB] Criando/atualizando estrutura do banco...');
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { 
          autoIncrement: true 
        });
        store.createIndex('timestamp', 'timestamp');
        store.createIndex('method', 'method');
        console.log('✅ [initOfflineDB] Store "pending-requests" criada!');
      }
    };
  });
};

// Salvar requisição offline
export const saveOfflineRequest = async (config) => {
  console.log('💾 [saveOfflineRequest] Iniciando salvamento...');
  console.log('   📍 URL:', config.url);
  console.log('   📍 Method:', config.method);
  console.log('   📍 Data:', config.data);
  
  await initOfflineDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const requestData = {
      url: config.url,
      method: config.method || 'POST',
      headers: config.headers || {},
      data: config.data,
      timestamp: Date.now(),
      endpoint: config.url.split('/').pop()
    };
    
    const request = store.add(requestData);
    
    request.onsuccess = () => {
      console.log(`✅ [saveOfflineRequest] Requisição SALVA com sucesso!`);
      console.log(`   🆔 ID: ${request.result}`);
      console.log(`   📊 Total no banco: ${request.result + 1}`);
      
      window.dispatchEvent(new CustomEvent('offline-request-saved', { 
        detail: { method: config.method, url: config.url }
      }));
      
      resolve(request.result);
    };
    
    request.onerror = () => {
      console.error('❌ [saveOfflineRequest] Erro ao salvar:', request.error);
      reject(request.error);
    };
  });
};

// Obter todas requisições pendentes
export const getPendingRequests = async () => {
  console.log('🔍 [getPendingRequests] Buscando requisições pendentes...');
  await initOfflineDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const requests = [];
    
    store.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        requests.push({ id: cursor.key, ...cursor.value });
        cursor.continue();
      } else {
        console.log(`📊 [getPendingRequests] Encontradas ${requests.length} requisições pendentes`);
        if (requests.length > 0) {
          console.log('   📋 Detalhes:', requests.map(r => ({ id: r.id, method: r.method, url: r.url })));
        }
        resolve(requests);
      }
    };
    transaction.onerror = () => {
      console.error('❌ [getPendingRequests] Erro:', transaction.error);
      reject(transaction.error);
    };
  });
};

// Remover requisição após enviar
export const deleteOfflineRequest = async (id) => {
  console.log(`🗑️ [deleteOfflineRequest] Removendo requisição ID: ${id}`);
  await initOfflineDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      console.log(`✅ [deleteOfflineRequest] Requisição ID ${id} REMOVIDA com sucesso!`);
      resolve();
    };
    
    request.onerror = () => {
      console.error(`❌ [deleteOfflineRequest] Erro ao remover ID ${id}:`, request.error);
      reject(request.error);
    };
  });
};

// Sincronizar todas requisições pendentes
export const syncOfflineRequests = async () => {
  console.log('🔄 [syncOfflineRequests] INICIANDO SINCRONIZAÇÃO...');
  
  const pending = await getPendingRequests();
  
  if (pending.length === 0) {
    console.log('✅ [syncOfflineRequests] Nenhuma requisição pendente para sincronizar');
    return { success: 0, failed: 0, total: 0 };
  }
  
  console.log(`📊 [syncOfflineRequests] Total a sincronizar: ${pending.length}`);
  let success = 0;
  let failed = 0;
  
  for (const req of pending) {
    console.log(`\n--- Sincronizando requisição ID ${req.id} ---`);
    console.log(`   Método: ${req.method}`);
    console.log(`   URL: ${req.url}`);
    console.log(`   Dados:`, req.data);
    
    try {
      const response = await fetch(req.url, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...req.headers
        },
        body: req.data ? JSON.stringify(req.data) : undefined
      });
      
      if (response.ok) {
        console.log(`✅ [syncOfflineRequests] Sucesso! Status: ${response.status}`);
        await deleteOfflineRequest(req.id);
        success++;
        console.log(`   ➕ Sucessos até agora: ${success}`);
      } else {
        console.log(`❌ [syncOfflineRequests] Falha! Status: ${response.status}`);
        failed++;
        console.log(`   ➕ Falhas até agora: ${failed}`);
      }
    } catch (error) {
      console.error(`❌ [syncOfflineRequests] Erro ao sincronizar:`, error);
      failed++;
    }
  }
  
  console.log(`\n📊 [syncOfflineRequests] SINCRONIZAÇÃO CONCLUÍDA!`);
  console.log(`   ✅ Sucessos: ${success}`);
  console.log(`   ❌ Falhas: ${failed}`);
  console.log(`   📦 Total: ${pending.length}`);
  
  // Verificar quantas sobraram no banco
  const remaining = await getPendingRequests();
  console.log(`   🗃️ Restam no banco: ${remaining.length} requisições`);
  
  window.dispatchEvent(new CustomEvent('offline-sync-complete', { 
    detail: { success, failed, total: pending.length }
  }));
  
  if (success > 0) {
    showNotification(`${success} ação(ões) sincronizada(s) com sucesso!`);
  }
  
  return { success, failed, total: pending.length };
};

// Notificação simples
const showNotification = (message) => {
  console.log(`🔔 [Notificação] ${message}`);
  if (Notification.permission === 'granted') {
    new Notification('Laco Favela', { body: message });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Laco Favela', { body: message });
      }
    });
  }
};

// Limpar requisições antigas
export const clearOldOfflineRequests = async (days = 30) => {
  console.log(`🧹 [clearOldOfflineRequests] Limpando requisições com mais de ${days} dias...`);
  await initOfflineDB();
  
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  const pending = await getPendingRequests();
  let deleted = 0;
  
  for (const req of pending) {
    if (req.timestamp < cutoff) {
      console.log(`   🗑️ Removendo requisição antiga ID ${req.id} - Data: ${new Date(req.timestamp)}`);
      await deleteOfflineRequest(req.id);
      deleted++;
    }
  }
  
  console.log(`✅ [clearOldOfflineRequests] Limpeza concluída: ${deleted} requisições removidas`);
  return deleted;
};