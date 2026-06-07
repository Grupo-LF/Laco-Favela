import React, { useState } from 'react';
import './styles/global.css';
import HomePage from './pages/morador/HomePage.jsx';
import NotificationPage from './pages/morador/NotificationPage';

function AppMorador() {
  const [activeView, setActiveView] = useState('home');

  const renderView = () => {
    switch(activeView) {
      case 'home': 
        return <HomePage onNavigate={setActiveView} />;

      case 'notificacoes': 
        return <NotificationPage />;
     
      default: 
        return <HomePage onNavigate={setActiveView} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <main className="main-content" style={{ flexGrow: 1, overflowY: 'auto' }}>
        {renderView()}
      </main>
    </div>
  );
}

export default AppMorador;