// frontend/src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/logo192.png'; // Importe a imagem do logo

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
      { id: 'familias', label: 'Famílias' },
      { id: 'formularios', label: 'Formulários' },
      { id: 'registros', label: 'Registros' }
    ],
    desempenho: [
      { id: 'meu-indicador', label: 'Meu indicador' },
      { id: 'ranking', label: 'Ranking' }
    ]
  };

  const menu = tipo === 'presidente' ? menuPresidente : menuAdmin;
  const isPresidente = tipo === 'presidente';

  // Detectar mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Função para sair
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

  // Nome do usuário
  const userNome = localStorage.getItem('nome') || 'Nome e Sobrenome';
  const userInitials = userNome.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <>
      {/* Botão Hamburger Mobile */}
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

      {/* Overlay Mobile */}
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

      {/* Sidebar */}
      <aside
        style={{
          width: isMobile ? '260px' : '18%',
          backgroundColor: '#035A8F',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          height: '100vh',
          position: isMobile ? 'fixed' : 'relative',
          left: isMobile && !isOpen ? '-260px' : '0',
          top: 0,
          zIndex: 1000,
          transition: 'left 0.3s ease',
          overflowY: 'auto'
        }}
      >
        {/* Botão Fechar Mobile */}
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

        {/* Logo com imagem */}
        <div className="logo-container">
          <img 
            src={logoImg} 
            alt="Logo" 
            className="logo"
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Perfil */}
        <div 
          className={`user-profile ${isPresidente ? 'clickable' : ''}`}
          onClick={() => isPresidente && handleNavigate('perfil')}
          style={{ cursor: isPresidente ? 'pointer' : 'default' }}
        >
          <div className="user-avatar">{userInitials}</div>
          <h5 className="user-name" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{userNome}</h5>
          <div className="badge" style={{position: 'absolute', top: '10%', right: '6%', padding:'6px ',textAlign:'start',fontSize: '0.75rem'}}>
            {isPresidente ? 'PRESIDENTE' : 'ADMIN'}
          </div>
        </div>

        {/* Menu Principal */}
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

        {/* Gestão (Admin) */}
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

        {/* Desempenho (Presidente) */}
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

        {/* Sair */}
        <div style={{ marginTop: 'auto' }}>
          <a
            href="#"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              handleSair();
            }}
          >
            <div className="nav-icon"></div>
            Sair
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;