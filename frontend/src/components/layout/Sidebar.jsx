// frontend/src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/logo192.png';

const Sidebar = ({ tipo, activeView, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Menu do ADMIN com ícones
  const menuAdmin = {
    principal: [
      { id: 'dashboard', label: 'Painel', icon: <span className="material-symbols-outlined">other_houses</span> },
      { id: 'formularios', label: 'Formulários', icon: <span className="material-symbols-outlined">description</span> }
    ],
    gestao: [
      { id: 'presidentes', label: 'Presidentes', icon: <span className="material-symbols-outlined">assignment_ind</span> },
      { id: 'familias', label: 'Famílias', icon: <span className="material-symbols-outlined">diversity_1</span> },
      { id: 'aprovados', label: 'Aprovados', icon: <span className="material-symbols-outlined">list_alt_check</span> }
    ],
    comunicacao: [
      { id: 'feedbacks', label: 'Feedbacks', icon: <span className="material-symbols-outlined">feedback</span> },
      { id: 'historico', label: 'Histórico', icon: <span className="material-symbols-outlined">history</span> }
    ]
  };

  // Menu do PRESIDENTE com ícones
  const menuPresidente = {
    principal: [
      { id: 'home', label: 'Home', icon: <span className="material-symbols-outlined">home</span> },
      { id: 'familias', label: 'Famílias', icon: <span className="material-symbols-outlined">diversity_1</span> },
      { id: 'formularios', label: 'Formulários', icon: <span className="material-symbols-outlined">description</span> },
      { id: 'registros', label: 'Registros', icon: <span className="material-symbols-outlined">list_alt_check</span> }
    ],
    desempenho: [
      { id: 'meu-indicador', label: 'Meu indicador', icon: <span className="material-symbols-outlined">bar_chart</span> },
      { id: 'ranking', label: 'Ranking', icon: <span className="material-symbols-outlined">emoji_events</span> }
    ]
  };

  const menu = tipo === 'presidente' ? menuPresidente : menuAdmin;
  const isPresidente = tipo === 'presidente';

  // Detectar mobile
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
    localStorage.removeItem('nome');
    window.location.href = '/';
  };

  const handleNavigate = (id) => {
    onNavigate(id);
    if (isMobile) setIsOpen(false);
  };

  const userNome = localStorage.getItem('nome') || 'Nome e Sobrenome';
  const userInitials = userNome.split(' ').map(n => n[0]).join('').toUpperCase();

  // Estilos
  const desktopStyles = {
    width: '18%',
    backgroundColor: '#035A8F',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    height: '100vh',
    position: 'relative',
    overflowY: 'auto'
  };

  const mobileStyles = {
    position: 'fixed',
    left: isOpen ? '0' : '-100%',
    top: 0,
    width: '80%',
    maxWidth: '300px',
    height: '100vh',
    backgroundColor: '#035A8F',
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
      {isMobile && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            top: '15px',
            left: '15px',
            zIndex: 1001,
            fontSize: '24px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            color: '#333'
          }}
        >
          ☰
        </button>
      )}

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
            zIndex: 999
          }}
        />
      )}

      <aside style={isMobile ? mobileStyles : desktopStyles}>
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            ✕
          </button>
        )}

        <div className="logo-container" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <img
            src={logoImg}
            alt="Logo"
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>

        <div className="user-profile" style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
          <div className="user-avatar" style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#FF6B35',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            {userInitials}
          </div>
          <div className="badge" style={{
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: '#FF6B35',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 'bold'
          }}>
            {isPresidente ? 'PRESIDENTE' : 'ADMIN'}
          </div>
          <h5 style={{ marginTop: '0.5rem', fontSize: '0.9rem', marginBottom: 0 }}>{userNome}</h5>
        </div>

        <div className="nav-section" style={{ marginBottom: '1.5rem' }}>
          <div className="nav-title" style={{ color: '#FF6B35', marginBottom: '0.5rem' }}>Principal</div>
          {menu.principal?.map(item => (
            <a
              key={item.id}
              href="#"
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(item.id);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.5rem 0' }}
            >
              <div className="nav-icon" style={{ display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </div>
              {item.label}
            </a>
          ))}
        </div>

        {menu.gestao && (
          <div className="nav-section" style={{ marginBottom: '1.5rem' }}>
            <div className="nav-title" style={{ marginBottom: '0.5rem' }}>Gestão</div>
            {menu.gestao.map(item => (
              <a
                key={item.id}
                href="#"
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(item.id);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.5rem 0' }}
              >
                <div className="nav-icon" style={{ display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </div>
                {item.label}
              </a>
            ))}
          </div>
        )}

        {menu.desempenho && (
          <div className="nav-section" style={{ marginBottom: '1.5rem' }}>
            <div className="nav-title" style={{ marginBottom: '0.5rem' }}>Desempenho</div>
            {menu.desempenho.map(item => (
              <a
                key={item.id}
                href="#"
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(item.id);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.5rem 0' }}
              >
                <div className="nav-icon" style={{ display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </div>
                {item.label}
              </a>
            ))}
          </div>
        )}

        {menu.comunicacao && (
          <div className="nav-section" style={{ marginBottom: '1.5rem' }}>
            <div className="nav-title" style={{ marginBottom: '0.5rem' }}>Comunicação</div>
            {menu.comunicacao.map(item => (
              <a
                key={item.id}
                href="#"
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(item.id);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.5rem 0' }}
              >
                <div className="nav-icon" style={{ display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </div>
                {item.label}
              </a>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          <a
            href="#"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              handleSair();
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.5rem 0' }}
          >
            <div className="nav-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <span className="material-symbols-outlined">logout</span>
            </div>
            Sair
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;