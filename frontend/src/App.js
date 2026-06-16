// App.js - SEM ALERTAS, SINCRONIZAÇÃO AUTOMÁTICA
import React, { useState, useEffect } from 'react';
import AppAdmin from './AppAdmin';
import AppPresidente from './AppPresidente';
import AppMorador from './AppMorador';
import Login from './pages/login/Login';
import { OfflineStatus } from './components/OfflineStatus';
import { initOfflineDB, syncOfflineRequests, getPendingRequests } from './services/offlineManager';

// Componente de Toast para notificações
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: '#4caf50',
    error: '#f44336',
    info: '#2196f3',
    warning: '#ff9800'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      zIndex: 10000,
      padding: '12px 20px',
      borderRadius: '8px',
      backgroundColor: colors[type],
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      animation: 'slideIn 0.3s ease'
    }}>
      {type === 'success' && '✅ '}
      {type === 'error' && '❌ '}
      {type === 'warning' && '⚠️ '}
      {type === 'info' && '📱 '}
      {message}
    </div>
  );
};

function App() {
  const [tipoUsuario, setTipoUsuario] = useState(localStorage.getItem('tipo'));
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Sincronização automática (sem perguntar)
  const autoSync = async () => {
    if (navigator.onLine && !isSyncing) {
      const pending = await getPendingRequests();
      
      if (pending.length > 0) {
        console.log(`🔄 Sincronizando ${pending.length} requisições pendentes...`);
        setIsSyncing(true);
        showToast(`Sincronizando ${pending.length} ação(ões)...`, 'info');
        
        const result = await syncOfflineRequests();
        
        if (result.success > 0) {
          showToast(`${result.success} ação(ões) sincronizada(s)!`, 'success');
          console.log(`✅ ${result.success} ações sincronizadas`);
        }
        
        if (result.failed > 0) {
          showToast(`${result.failed} ação(ões) falharam. Veja o console.`, 'error');
          console.error(`❌ ${result.failed} ações falharam:`);
          if (result.failedList) {
            result.failedList.forEach(f => {
              console.error(`   - ${f.method} ${f.url}: ${f.status || f.error}`);
            });
          }
        }
        
        setIsSyncing(false);
        
        // Recarregar dados se houve sucesso
        if (result.success > 0) {
          setTimeout(() => {
            window.dispatchEvent(new Event('refresh-data'));
          }, 500);
        }
      }
    }
  };

  // Inicializar banco offline
  useEffect(() => {
    initOfflineDB().then(() => {
      console.log('✅ Banco offline inicializado');
      // Sincronizar automaticamente ao iniciar
      autoSync();
    });
  }, []);

  // Listener para quando voltar online (sem perguntar)
  useEffect(() => {
    const handleOnline = () => {
      console.log('🟢 Internet conectada! Sincronizando automaticamente...');
      autoSync();
    };

    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [isSyncing]);

  const handleLogin = (tipo, token, nome) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tipo', tipo);
    localStorage.setItem('nome', nome);
    setTipoUsuario(tipo);
  };  
  
  const handleLoginTest = (tipo) => {
    localStorage.setItem('tipo', tipo);
    console.log('Tipo de usuário salvo no localStorage (modo teste):', tipo);
    setTipoUsuario(tipo);
  }
  
  // Se não tem tipo, mostra login
  if (!tipoUsuario) return <Login onLogin={handleLogin} handleLoginTest={handleLoginTest} />;

  // Se tem tipo, mostra app correspondente com o componente de status offline
  const renderApp = () => {
    let AppComponent;
    if (tipoUsuario === 'morador') AppComponent = AppMorador;
    else if (tipoUsuario === 'admin') AppComponent = AppAdmin;
    else if (tipoUsuario === 'presidente') AppComponent = AppPresidente;
    else return null;
    
    return (
      <>
        <AppComponent />
        <OfflineStatus />
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </>
    );
  };

  return renderApp();
}

// Adicionar animação CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);

export default App;