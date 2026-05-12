import React from 'react';

const Sidebar = ({ activeView, onNavigate }) => {
  const menuItems = {
    principal: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'formularios', label: 'Formulários' }
    ],
    gestao: [
      { id: 'presidentes', label: 'Presidentes' },
      { id: 'familias', label: 'Famílias' },
      { id: 'aprovados', label: 'Aprovados' }
    ],
    comunicacao: [
      { id: 'feedbacks', label: 'Feedbacks' },
      { id: 'historico', label: 'Histórico' }
    ]
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo">Logo</div>
      </div>
      
      <div className="user-profile">
        <div className="user-avatar">NS</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Administrador</div>
        <div className="badge" style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.3)' }}>ADMIN</div>
      </div>

      <div className="nav-section">
        <div className="nav-title">Principal</div>
        {menuItems.principal.map(item => (
          <a
            key={item.id}
            href="#"
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.id);
            }}
          >
            <div className="nav-icon"></div>
            {item.label}
          </a>
        ))}
      </div>

      <div className="nav-section">
        <div className="nav-title">Gestão</div>
        {menuItems.gestao.map(item => (
          <a
            key={item.id}
            href="#"
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.id);
            }}
          >
            <div className="nav-icon"></div>
            {item.label}
          </a>
        ))}
      </div>

      <div className="nav-section">
        <div className="nav-title">Comunicação</div>
        {menuItems.comunicacao.map(item => (
          <a
            key={item.id}
            href="#"
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.id);
            }}
          >
            <div className="nav-icon"></div>
            {item.label}
          </a>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <a href="#" className="nav-item">
          <div className="nav-icon"></div>
          Sair
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;