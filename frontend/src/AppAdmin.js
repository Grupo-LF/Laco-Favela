import React, { useState } from 'react';
import './styles/global.css';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/admin/Dashboard';
import Formularios from './pages/admin/Formularios';
import CriarFormulario from './pages/admin/CriarFormulario';
import VerFormulario from './pages/admin/VerFormulario';
import Presidentes from './pages/admin/Presidentes';
import Familias from './pages/admin/Familias';
import Aprovados from './pages/admin/Aprovados';
import Feedbacks from './pages/admin/Feedbacks';
import Historico from './pages/admin/Historico';

function AppAdmin() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard />;
      case 'formularios': return <Formularios onNavigate={setActiveView} />;
      case 'criar-formulario': return <CriarFormulario onNavigate={setActiveView} />;
      case 'ver-formulario': return <VerFormulario onNavigate={setActiveView} />;
      case 'presidentes': return <Presidentes onNavigate={setActiveView} />;
      case 'familias': return <Familias />;
      case 'aprovados': return <Aprovados />;
      case 'feedbacks': return <Feedbacks />;
      case 'historico': return <Historico />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', border: 'solid' }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default AppAdmin;