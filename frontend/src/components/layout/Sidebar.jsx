// frontend/src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/logo192.png';
import { ReactComponent as IconDashboard } from '../../assets/sidebar/home.svg';
import { ReactComponent as IconFormularios } from '../../assets/assignment.svg';
import { ReactComponent as IconPresidentes } from '../../assets/sidebar/assignment_ind.svg';
import { ReactComponent as IconFamilias } from '../../assets/sidebar/diversity_1.svg';
import { ReactComponent as IconAprovados } from '../../assets/sidebar/list_alt_check.svg';
import { ReactComponent as IconFeedbacks } from '../../assets/sidebar/feedback.svg';
import { ReactComponent as IconHistorico } from '../../assets/sidebar/history.svg';
import { ReactComponent as IconHome } from '../../assets/sidebar/home.svg';
import { ReactComponent as IconRegistros } from '../../assets/sidebar/home.svg';
import { ReactComponent as IconMeuIndicador } from '../../assets/sidebar/home.svg';
import { ReactComponent as IconRanking } from '../../assets/sidebar/home.svg';
import { ReactComponent as IconLogout } from '../../assets/sidebar/logout.svg';
import { ReactComponent as IconNotificacoes } from '../../assets/sidebar/feedback.svg';
import { ReactComponent as IconAcompanhamento } from '../../assets/sidebar/history.svg';
import { ReactComponent as IconSerPresidente } from '../../assets/sidebar/assignment_ind.svg';

const Sidebar = ({ tipo, activeView, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hoveredItem, setHoveredItem] = useState(null);

  const renderIcon = (IconComponent, itemId, isActive) => {
    const isHovered = hoveredItem === itemId;
    const isHighlighted = (isHovered || isActive);
    
    const getFilter = () => {
      if (!isHighlighted) {
        return 'brightness(0) saturate(100%) invert(75%) sepia(57%) saturate(1472%) hue-rotate(338deg) brightness(101%) contrast(101%)';
      } else {
        return 'brightness(0) saturate(100%) invert(15%) sepia(89%) saturate(2558%) hue-rotate(169deg) brightness(94%) contrast(106%)';
      }
    };

    return (
      <div style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconComponent style={{ width: '20px', height: '20px', filter: getFilter(), transition: 'filter 0.2s ease' }} />
      </div>
    );
  };

  const menuAdmin = {
    principal: [
      { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
      { id: 'formularios', label: 'Formulários', icon: IconFormularios }
    ],
    gestao: [
      { id: 'presidentes', label: 'Presidentes', icon: IconPresidentes },
      { id: 'familias', label: 'Famílias', icon: IconFamilias },
      { id: 'aprovados', label: 'Aprovados', icon: IconAprovados }
    ],
    comunicacao: [
      { id: 'feedbacks', label: 'Feedbacks', icon: IconFeedbacks },
      { id: 'historico', label: 'Histórico', icon: IconHistorico }
    ]
  };

  const menuPresidente = {
    principal: [
      { id: 'home', label: 'Home', icon: IconHome },
      { id: 'familias', label: 'Famílias', icon: IconFamilias },
      { id: 'formularios', label: 'Formulários', icon: IconFormularios },
      { id: 'registros', label: 'Registros', icon: IconRegistros }
    ],
    desempenho: [
      { id: 'meu-indicador', label: 'Meu indicador', icon: IconMeuIndicador },
      { id: 'ranking', label: 'Ranking', icon: IconRanking }
    ]
  };

  const menuMorador = {
    principal: [
      { id: 'home', label: 'Início', icon: IconHome },
      { id: 'notificacoes', label: 'Notificações', icon: IconNotificacoes },
      { id: 'acompanhamento', label: 'Acompanhamento', icon: IconAcompanhamento },
    ],
    desempenho: [
      { id: 'ranking', label: 'Ranking', icon: IconRanking },
      { id: 'ser-presidente', label: 'Ser Presidente', icon: IconSerPresidente },
      { id: 'feedback', label: 'Feedback', icon: IconFeedbacks },
    ]
  };

  const menu = tipo === 'presidente' ? menuPresidente : tipo === 'morador' ? menuMorador : menuAdmin;
  const isPresidente = tipo === 'presidente';
  const isMorador = tipo === 'morador';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsOpen(false);
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

  const getTextColor = (itemId, isActive) => {
    const isHovered = hoveredItem === itemId;
    const isHighlighted = (isHovered || isActive);
    return isHighlighted ? 'var(--color-primary)' : 'var(--color-accent)';
  };

  const navItemStyle = (itemId, isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: getTextColor(itemId, isActive),
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  });

  return (
    <>
      {isMobile && (
        <button onClick={() => setIsOpen(true)} style={{ position: 'fixed', top: '15px', left: '15px', zIndex: 1001, fontSize: '24px', cursor: 'pointer', background: 'none', border: 'none', color: '#333' }}>
          ☰
        </button>
      )}

      {isMobile && isOpen && (
        <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
      )}

      <aside style={{ width: isMobile ? '260px' : '18%', backgroundColor: '#035A8F', color: 'white', display: 'flex', flexDirection: 'column', padding: '1rem', height: '100vh', position: isMobile ? 'fixed' : 'relative', left: isMobile && !isOpen ? '-260px' : '0', top: 0, zIndex: 1000, transition: 'left 0.3s ease', overflowY: 'auto' }}>

        {isMobile && (
          <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'white' }}>
            ✕
          </button>
        )}

        <div className="logo-container">
          <img src={logoImg} alt="Logo" className="logo" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }} />
        </div>

        <div
          className="user-profile"
          onClick={() => (isPresidente || isMorador) && handleNavigate('perfil')}
          style={{ cursor: (isPresidente || isMorador) ? 'pointer' : 'default' }}
        >
          <div className="user-avatar">{userInitials}</div>
          <h5 className="user-name" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{userNome}</h5>
          <div className="badge" style={{ position: 'absolute', top: '10%', right: '6%', padding: '6px', textAlign: 'start', fontSize: '0.75rem' }}>
            {tipo === 'presidente' ? 'PRESIDENTE' : tipo === 'morador' ? 'MORADOR' : 'ADMIN'}
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-title">Principal</div>
          {menu.principal?.map(item => (
            <a key={item.id} href="#" className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavigate(item.id); }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={navItemStyle(item.id, activeView === item.id)}
            >
              {renderIcon(item.icon, item.id, activeView === item.id)}
              {item.label}
            </a>
          ))}
        </div>

        {menu.gestao && (
          <div className="nav-section">
            <div className="nav-title">Gestão</div>
            {menu.gestao.map(item => (
              <a key={item.id} href="#" className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigate(item.id); }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={navItemStyle(item.id, activeView === item.id)}
              >
                {renderIcon(item.icon, item.id, activeView === item.id)}
                {item.label}
              </a>
            ))}
          </div>
        )}

        {menu.desempenho && (
          <div className="nav-section">
            <div className="nav-title">Desempenho</div>
            {menu.desempenho.map(item => (
              <a key={item.id} href="#" className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigate(item.id); }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={navItemStyle(item.id, activeView === item.id)}
              >
                {renderIcon(item.icon, item.id, activeView === item.id)}
                {item.label}
              </a>
            ))}
          </div>
        )}

        {menu.comunicacao && (
          <div className="nav-section">
            <div className="nav-title">Comunicação</div>
            {menu.comunicacao.map(item => (
              <a key={item.id} href="#" className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigate(item.id); }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={navItemStyle(item.id, activeView === item.id)}
              >
                {renderIcon(item.icon, item.id, activeView === item.id)}
                {item.label}
              </a>
            ))}
          </div>
        )}

        {/* Bloco de Saída idêntico ao Figma */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <button
            onClick={handleSair}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              backgroundColor: hoveredItem === 'logout' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              fontFamily: 'inherit',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            <div style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconLogout 
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  filter: 'brightness(0) invert(1)', 
                  transition: 'filter 0.2s ease' 
                }} 
              />
            </div>
            Sair
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;