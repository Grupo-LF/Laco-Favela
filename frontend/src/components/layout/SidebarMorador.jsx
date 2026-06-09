import { useState } from 'react';
import '../../styles/pages/morador/SidebarMorador.css';

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);
const IconNotificacoes = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconAcompanhamento = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18l5-5 4 4 5-6 4 4" />
  </svg>
);
const IconRanking = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconSerPresidente = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    <polyline points="14 14 16 20 12 17 8 20 10 14" />
  </svg>
);
const IconFeedback = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const NAV_PRINCIPAL = [
  { id: 'home',           label: 'Início',         icon: IconHome },
  { id: 'notificacoes',   label: 'Notificações',  icon: IconNotificacoes },
  { id: 'acompanhamento', label: 'Acompanhamento',icon: IconAcompanhamento },
];

// IDs mapeados para bater com o gerenciador de telas do seu app
const NAV_DESEMPENHO = [
  { id: 'ranking',        label: 'Ranking',       icon: IconRanking },
  { id: 'ser-presidente', label: 'Ser Presidente',icon: IconSerPresidente }, // Aciona Ser_presidente.jsx
  { id: 'feedback',       label: 'Feedback',      icon: IconFeedback },       // Aciona Feedback.jsx
];

export default function SidebarMorador({ activeView, onNavigate }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    window.location.reload();
  };

  const nome = localStorage.getItem('nome') || 'Pedro Pereira';
  const iniciais = nome.split(' ').slice(0, 2).map(p => p[0].toUpperCase()).join('');

  return (
    <aside className="sbm">
      <div className="sbm__logo">
        <div className="sbm__logo-badge">
          <span className="sbm__logo-main">LAÇO</span>
          <span className="sbm__logo-sub">Favela</span>
        </div>
      </div>

      <div className="sbm__user">
        {/* Envia 'perfil' para abrir o arquivo Perfil_morador.jsx */}
        <button 
          className={`sbm__perfil-btn${activeView === 'perfil' ? ' sbm__perfil-btn--active' : ''}`} 
          onClick={() => onNavigate('perfil')}
        >
          Ver Perfil
        </button>
        <div className="sbm__avatar">{iniciais}</div>
        <span className="sbm__nome">{nome}</span>
      </div>

      <nav className="sbm__nav">
        <span className="sbm__section-label">Principal</span>
        {NAV_PRINCIPAL.map(item => (
          <button
            key={item.id}
            className={`sbm__item${activeView === item.id ? ' sbm__item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sbm__item-icon"><item.icon /></span>
            {item.label}
          </button>
        ))}
        
        <span className="sbm__section-label">Desempenho</span>
        {NAV_DESEMPENHO.map(item => (
          <button
            key={item.id}
            className={`sbm__item${activeView === item.id ? ' sbm__item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sbm__item-icon"><item.icon /></span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sbm__footer">
        <button className="sbm__logout" onClick={handleLogout}>
          <span className="sbm__item-icon"><IconLogout /></span>
          Sair
        </button>
      </div>
    </aside>
  );
}