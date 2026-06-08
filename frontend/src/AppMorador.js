import React, { useState } from 'react';
import './styles/global.css';
import SidebarMorador from './components/layout/SidebarMorador';
import HomePage from './pages/morador/HomePage';
import NotificationPage from './pages/morador/NotificationPage';
import AcompanhamentoPage from './pages/morador/AcompanhamentoPage';
import RankingPage from './pages/morador/RankingPage';

function AppMorador() {
  const [activeView, setActiveView] = useState('home');

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage onNavigate={setActiveView} />;
      case 'notificacoes':
        return <NotificationPage />;
      case 'acompanhamento':
        return <AcompanhamentoPage />;
      case 'ranking':
        return <RankingPage />;
      case 'ser-presidente':
        return <div >Ser Presidente (em breve)</div>;
      case 'feedback':
        return <div >Feedback (em breve)</div>;
      case 'perfil':
        return <div >Perfil (em breve)</div>;
      default:
        return <HomePage onNavigate={setActiveView} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <SidebarMorador activeView={activeView} onNavigate={setActiveView} />
      <main className="main-content" style={{ flexGrow: 1, overflowY: 'auto' }}>
        {renderView()}
      </main>
    </div>
  );
}

export default AppMorador;
