import React, { useState } from 'react';
import './styles/global.css';
import SidebarMorador from './components/layout/SidebarMorador';
import HomePage from './pages/morador/HomePage';
import NotificationPage from './pages/morador/NotificationPage';

// 1. IMPORTANDO AS SUAS NOVAS PÁGINAS AQUI:
import Feedback from './pages/morador/Feedback';
import PerfilMorador from './pages/morador/Perfil_morador';
import SerPresidente from './pages/morador/Ser_presidente';

function AppMorador() {
  const [activeView, setActiveView] = useState('home');

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage onNavigate={setActiveView} />;
      case 'notificacoes':
        return <NotificationPage />;
      case 'acompanhamento':
        return <div>Acompanhamento (em breve)</div>;
      case 'ranking':
        return <div>Ranking (em breve)</div>;
      
      // 2. SUBSTITUINDO OS "EM BREVE" PELOS COMPONENTES REAIS:
      case 'ser-presidente':
        return <SerPresidente />;
      case 'feedback':
        return <Feedback />;
      case 'perfil':
        return <PerfilMorador />;
        
      default:
        return <HomePage onNavigate={setActiveView} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <SidebarMorador activeView={activeView} onNavigate={setActiveView} />
      <main className="main-content" style={{ flexGrow: 1, overflowY: 'auto', backgroundColor: '#f4f6f8' }}>
        {renderView()}
      </main>
    </div>
  );
}

export default AppMorador;