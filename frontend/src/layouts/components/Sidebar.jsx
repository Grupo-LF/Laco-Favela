// layouts/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';

const Sidebar = ({ tipo, activeView, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  // Verificar tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSair = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    window.location.href = '/';
  };

  const handleNavigate = (id) => {
    onNavigate(id);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Dados do usuário vindo do localStorage
  const userNome = localStorage.getItem('nome') || 'Nome e Sobrenome';
  const userInitials = userNome.split(' ').map(n => n[0].toUpperCase()).join('');

  // Estilos para desktop
  const desktopStyles = {
    width: '18%',
    backgroundColor: 'var(--bg-sidebar)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 'clamp(1.2rem, 2.3vh, 0.8rem)',
    height: '100vh',
    flexShrink: 0,
    transition: 'all 0.3s ease',
    overflowY: 'auto',
    position: 'relative'
  };

  // Estilos para mobile
  const mobileStyles = {
    position: 'fixed',
    left: isOpen ? '0' : '-100%',
    top: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: 'var(--bg-sidebar)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    zIndex: 1000,
    transition: 'left 0.3s ease',
    overflowY: 'auto',
    boxShadow: isOpen ? '2px 0 10px rgba(0,0,0,0.3)' : 'none'
  };

  return (
    <>
      {/* Botão Hamburger - apenas mobile */}
      {isMobile && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            top: '15px',
            left: '15px',
            outline: 'none',
            zIndex: 1001,
            fontSize: '24px',
            cursor: 'pointer',
            background: 'none',
            transform: 'scale(1.2)',
            border: 'none',
            color: '#333',
            padding: '10px 12px'
          }}
        >
          ☰
        </button>
      )}

      {/* Overlay - apenas quando mobile e sidebar aberta */}
      {isMobile && isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            cursor: 'pointer'
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={isMobile ? mobileStyles : desktopStyles}>
        {/* Botão fechar - apenas mobile */}
        {isMobile && (
          <button 
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'white',
              padding: '5px'
            }}
          >
            ✕
          </button>
        )}

        <div className="logo-container">
          <div className="logo">Logo</div>
        </div>

        <div 
          className="user-profile"
          style={{ position: 'relative' }}
        >
          <div className="user-avatar">{userInitials}</div>
          <h5 style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{userNome}</h5>
          <div 
            className="badge" 
            style={{
              position: 'absolute', 
              right: '6%', 
              top: '10.5%',
              cursor: isPresidente ? 'pointer' : 'default'
            }}
            onClick={() => isPresidente && handleNavigate('perfil')}
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
                handleNavigate(item.id);
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
                  handleNavigate(item.id); 
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
                  handleNavigate(item.id); 
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
                  handleNavigate(item.id); 
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
    </>
  );
};

export default Sidebar;