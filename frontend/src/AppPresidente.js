import React, { useState } from 'react';
import './styles/global.css';
import SidebarPresidente from './components/layout/SidebarPresidente';
import HomePage from './pages/presidente/HomePage';

function AppPresidente() {
  const [activeView, setActiveView] = useState('home');

  const renderView = () => {
    switch(activeView) {
      case 'home': return <HomePage onNavigate={setActiveView} />;
      case 'familias': return <div>Famílias (em breve)</div>;
      case 'formularios': return <div>Formulários (em breve)</div>;
      case 'registros': return <div>Registros (em breve)</div>;
      case 'meu-indicador': return <div>Meu Indicador (em breve)</div>;
      case 'ranking': return <div>Ranking (em breve)</div>;
      default: return <HomePage onNavigate={setActiveView} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <SidebarPresidente activeView={activeView} onNavigate={setActiveView} />
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default AppPresidente;