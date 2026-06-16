// Gerenciador de fila offline
const DB_NAME = 'offline-db';
const STORE_NAME = 'pending-requests';
let db = null;

// Abrir/Inicializar IndexedDB
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { 
          autoIncrement: true 
        });
        store.createIndex('timestamp', 'timestamp');
      }
    };
  });
};

// Salvar requisição quando offline
export const saveRequest = (url, method, body, headers) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      initDB().then(() => saveRequest(url, method, body, headers));
      return;
    }
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = {
      url,
      method,
      body,
      headers,
      timestamp: Date.now(),
      retries: 0
    };
    
    const addRequest = store.add(request);
    addRequest.onsuccess = () => {
      console.log('📱 Requisição salva offline:', url);
      // Notificar usuário
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'REQUEST_SAVED',
          url: url
        });
      }
      resolve(addRequest.result);
    };
    addRequest.onerror = () => reject(addRequest.error);
  });
};

// Obter todas as requisições pendentes
export const getPendingRequests = () => {
  return new Promise((resolve, reject) => {
    if (!db) {
      initDB().then(() => getPendingRequests());
      return;
    }
    
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const requests = [];
    
    store.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        requests.push(cursor.value);
        cursor.continue();
      } else {
        resolve(requests);
      }
    };
  });
};

// Remover requisição após enviar
export const deleteRequest = (id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Tentar reenviar todas as requisições pendentes
export const syncPendingRequests = async () => {
  const pending = await getPendingRequests();
  console.log(`🔄 Tentando reenviar ${pending.length} requisições...`);
  
  for (const req of pending) {
    try {
      const response = await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body
      });
      
      if (response.ok) {
        await deleteRequest(req.id);
        console.log(`✅ Requisição reenviada: ${req.url}`);
        
        // Notificar usuário via toast
        showNotification('✅ Dados enviados com sucesso!');
      } else {
        console.log(`❌ Falha ao reenviar: ${req.url} - Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao reenviar ${req.url}:`, error);
    }
  }
};

// Notificação para o usuário
const showNotification = (message) => {
  if (Notification.permission === 'granted') {
    new Notification('Laco Favela', { body: message });
  }
};