// src/components/OfflineStatus.jsx
import React, { useState, useEffect } from 'react';
import { getPendingRequests, syncOfflineRequests } from '../services/offlineManager';

export const OfflineStatus = () => {
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showToast, setShowToast] = useState(false);
  
  useEffect(() => {
    // Carregar pendências
    const loadPending = async () => {
      try {
        const requests = await getPendingRequests();
        setPending(requests.length);
      } catch (error) {
        console.error('Erro ao carregar pendências:', error);
      }
    };
    
    loadPending();
    
    // Verificar status de conexão
    const handleOnline = () => {
      setIsOffline(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      loadPending();
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Escutar eventos de sincronização
    const handleSyncComplete = () => loadPending();
    const handleRequestSaved = () => loadPending();
    
    window.addEventListener('offline-sync-complete', handleSyncComplete);
    window.addEventListener('offline-request-saved', handleRequestSaved);
    
    // Atualizar a cada 15 segundos
    const interval = setInterval(loadPending, 15000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offline-sync-complete', handleSyncComplete);
      window.removeEventListener('offline-request-saved', handleRequestSaved);
      clearInterval(interval);
    };
  }, []);
  
  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncOfflineRequests();
      if (result.success > 0) {
        // Opcional: mostrar notificação de sucesso
        if (window.toast) {
          // Se você tiver um sistema de toast
          window.toast.success(`${result.success} ação(ões) sincronizada(s)`);
        }
        // Recarregar dados da página após 1 segundo
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
    } finally {
      setSyncing(false);
    }
  };
  
  // Toast de status de conexão
  if (showToast) {
    return (
      <div style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        animation: 'slideDown 0.3s ease'
      }}>
        <div style={{
          background: isOffline ? '#f44336' : '#4caf50',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {isOffline ? '🔌 Você está offline' : '🟢 Internet conectada!'}
        </div>
        <style>
          {`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
              }
            }
          `}
        </style>
      </div>
    );
  }
  
  // Botão flutuante para pendências
  if (pending === 0 && !isOffline) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
      {isOffline && (
        <div style={{
          background: '#f44336',
          color: 'white',
          padding: '10px 15px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 'bold',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span>🔌</span>
          Offline
        </div>
      )}
      
      {pending > 0 && (
        <button
          onClick={handleSync}
          disabled={syncing}
          style={{
            background: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '12px 20px',
            cursor: syncing ? 'wait' : 'pointer',
            fontSize: 14,
            fontWeight: 'bold',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
            opacity: syncing ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!syncing) e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            if (!syncing) e.target.style.transform = 'scale(1)';
          }}
        >
          <span>📱</span>
          {syncing ? (
            <>Sincronizando <span style={{ animation: 'pulse 1s infinite' }}>...</span></>
          ) : (
            <>{pending} pendente(s)</>
          )}
        </button>
      )}
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};