import React from 'react';

const SidebarPresidente = ({ activeView, onNavigate }) => {
  const menuItems = {
    principal: [
      { id: 'home', label: 'Home' },
      { id: 'familias', label: 'Famílias' },
      { id: 'formularios', label: 'Formulários' },
      { id: 'registros', label: 'Registros' },
    ],
    desempenho: [
      { id: 'meu-indicador', label: 'Meu indicador' },
      { id: 'ranking', label: 'Ranking' },
    ]
  };

  // Função mais simples possível para sair
  const handleSair = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    window.location.href = '/';
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo">Logo</div>
      </div>
      <div className="user-profile">
        <div className="user-avatar">NS</div>
        <h5 style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Nome e Sobrenome</h5>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Presidente</span>
      </div>
      <div className="nav-section">
        <div className="nav-title">Principal</div>
        {menuItems.principal.map(item => (
          <a key={item.id} href="#" className={`nav-item ${activeView === item.id ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}>
            <div className="nav-icon"></div>
            {item.label}
          </a>
        ))}
      </div>
      <div className="nav-section">
        <div className="nav-title">Desempenho</div>
        {menuItems.desempenho.map(item => (
          <a key={item.id} href="#" className={`nav-item ${activeView === item.id ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}>
            <div className="nav-icon"></div>
            {item.label}
          </a>
        ))}
      </div>
      <div style={{ marginTop: 'auto' }}>
        <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); handleSair(); }}>
          <div className="nav-icon"></div>
          Sair
        </a>
      </div>
    </aside>
  );
};

export default SidebarPresidente;