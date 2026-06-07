import React, { useState } from 'react';
import './styles/global.css';
import Sidebar from './layouts/components/Sidebar';  // ← MUDEI AQUI
import HomePage from './pages/presidente/HomePage';
import FamiliasPage from './pages/presidente/FamiliasPage';
import MeuIndicadorPage from './pages/presidente/MeuIndicadorPage';
import RankingPage from './pages/presidente/RankingPage';
import PerfilPage from './pages/presidente/PerfilPage';
import FormularioPage from './pages/presidente/FormularioPage';

function AppPresidente() {
  const [activeView, setActiveView] = useState('home');

  const renderView = () => {
    switch(activeView) {
      case 'home': 
        return <HomePage onNavigate={setActiveView} />;
      case 'familias': 
        return <FamiliasPage />;
      case 'formularios': 
        return <div>formularios (em breve)</div>;
      case 'registros': 
        return <div>Registros (em breve)</div>;
      case 'meu-indicador': 
        return <MeuIndicadorPage />;
      case 'ranking': 
        return <RankingPage />;
      case 'perfil': 
        return <PerfilPage />;
      default: 
        return <HomePage onNavigate={setActiveView} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar 
        tipo="presidente"           // ← NOVO: diz que é presidente
        activeView={activeView} 
        onNavigate={setActiveView} 
      />
      <main className="main-content" style={{ flexGrow: 1, overflowY: 'auto' }}>
        {renderView()}
      </main>
    </div>
  );
}

export default AppPresidente;