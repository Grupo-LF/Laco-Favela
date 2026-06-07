// layouts/components/Sidebar.jsx
import React from 'react';

const Sidebar = ({ tipo, activeView, onNavigate }) => {
  // Menu do ADMIN
  const menuAdmin = {
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

  // Menu do PRESIDENTE
  const menuPresidente = {
    principal: [
      { id: 'home', label: 'Home' },
      { id: 'formularios', label: 'Formulários' },
      { id: 'registros', label: 'Registros' }
    ],
    desempenho: [
      { id: 'meu-indicador', label: 'Meu Indicador' },
      { id: 'ranking', label: 'Ranking' }
    ]
  };

  // Escolhe o menu baseado no tipo
  const menu = tipo === 'presidente' ? menuPresidente : menuAdmin;
  const isPresidente = tipo === 'presidente';

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

      <div 
        className="user-profile"
        style={{ position: 'relative' }}
      >
        <div className="user-avatar">NS</div>
        <h5>Nome e Sobrenome</h5>
        <div 
          className="badge" 
          style={{
            position: 'absolute', 
            right: '6%', 
            top: '10.5%',
            cursor: isPresidente ? 'pointer' : 'default'
          }}
          onClick={() => isPresidente && onNavigate('perfil')}
        >
          {isPresidente ? 'Ver Perfil' : 'ADMIN'}
        </div>
      </div>

      {/* Principal */}
      <div className="nav-section">
        <div className="nav-title">Principal</div>
        {menu.principal?.map(item => (
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

      {/* Gestão (Admin) ou Desempenho (Presidente) */}
      {menu.gestao && (
        <div className="nav-section">
          <div className="nav-title">Gestão</div>
          {menu.gestao.map(item => (
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
      )}

      {menu.desempenho && (
        <div className="nav-section">
          <div className="nav-title">Desempenho</div>
          {menu.desempenho.map(item => (
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
      )}

      {/* Comunicação (só Admin) */}
      {menu.comunicacao && (
        <div className="nav-section">
          <div className="nav-title">Comunicação</div>
          {menu.comunicacao.map(item => (
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
      )}

      <div style={{ marginTop: 'auto' }}>
        <a href="#" className="nav-item" onClick={(e) => { 
          e.preventDefault(); 
          handleSair(); 
        }}>
          <div className="nav-icon"></div>
          Sair
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;