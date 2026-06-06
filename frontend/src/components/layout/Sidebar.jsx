import React, { useState, useEffect } from 'react';

const Sidebar = ({ activeView, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
        
        <div className="user-profile">
          <div className="user-avatar">
            {localStorage.getItem('nome') 
              ? localStorage.getItem('nome').split(' ').map(n => n[0].toUpperCase()).join('')
              : 'N'}
          </div>
          <div className='badge' style={{ 
            marginTop: '0.5rem', 
            background: 'rgba(255,255,255,0.3)', 
            position: 'absolute', 
            top: '10%', 
            right: '7%' 
          }}>ADMIN</div>
          <h5 style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {localStorage.getItem('nome') || 'Nome e Sobrenome'}
          </h5>
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
                handleNavigate(item.id);
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
                handleNavigate(item.id);
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
                handleNavigate(item.id);
              }}
            >
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
    </>
  );
};

export default Sidebar;