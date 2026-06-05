import { useState } from 'react';
import './HomePage.css';

/* ── Ícone do protótipo: quadrado preto com diagonal branca ── */
function ProtoIcon({ size = 33 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="black"/>
      <line x1="0.707107" y1="0.7072" x2="31.7374" y2="31.7375" stroke="white" strokeWidth="2"/>
    </svg>
  );
}

/* ── Sidebar nav data ───────────────────────────────── */
const NAV = [
  { label: 'Home',           section: 'PRINCIPAL' },
  { label: 'Notificações',   section: null },
  { label: 'Acompanhamento', section: null },
  { label: 'Ranking',        section: 'PARTICIPAÇÃO' },
  { label: 'Ser Presidente', section: null },
  { label: 'Feedback',       section: null },
];

/* ── Quick access data ──────────────────────────────── */
const QUICK = [
  'Acompanhamento',
  'Ranking',
  'Feedback Anônimo',
  'Ser Presidente',
];

/* ── Events data ────────────────────────────────────── */
const EVENTS = [
  {
    id: 1,
    name: 'Reunião Comunitária',
    meta: '11/06/2026 · 18h no Centro Comunitário de Fitilho',
  },
  {
    id: 2,
    name: 'Ação para Crianças',
    meta: '18/06/2026 · 16h na Praça Central Laço',
  },
];

/* ── Component ──────────────────────────────────────── */
export default function HomePage() {
  const [activeNav, setActiveNav] = useState('Home');

  return (
    <div className="home-layout">

      {/* ── Sidebar ─────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar__logo-wrap">
          <div className="sidebar__logo">Logo</div>
        </div>

        <div className="sidebar__profile">
          <div className="sidebar__avatar">NS</div>
          <div>
            <div className="sidebar__profile-name">Nome e Sobrenome</div>
            <div className="sidebar__profile-role">Morador</div>
          </div>
        </div>

        <nav>
          {NAV.map((item) => (
            <div key={item.label}>
              {item.section && (
                <div className="sidebar__section-label">{item.section}</div>
              )}
              <div
                className={
                  'sidebar__nav-item' +
                  (activeNav === item.label ? ' sidebar__nav-item--active' : '')
                }
                onClick={() => setActiveNav(item.label)}
              >
                <span className="sidebar__nav-icon">
                  <ProtoIcon size={18} />
                </span>
                {item.label}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <ProtoIcon size={16} />
          Sair
        </div>
      </aside>

      {/* ── Main ────────────────────────────── */}
      <div className="main">

        {/* Topbar */}
        <header className="topbar">Home</header>

        {/* Content */}
        <main className="content">
          <h1 className="content__greeting">Olá, Nome!</h1>

          {/* Quick access */}
          <div className="section-title">Acesso Rápido</div>
          <div className="quick-access">
            {QUICK.map((label) => (
              <div className="quick-card" key={label}>
                <div className="quick-card__icon">
                  <ProtoIcon size={33} />
                </div>
                <span className="quick-card__label">{label}</span>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="bottom-row">

            {/* Próximos Eventos */}
            <div className="events-card">
              <div className="events-card__title">Próximos Eventos</div>
              {EVENTS.map((ev) => (
                <div className="event-item" key={ev.id}>
                  <div className="event-item__name">{ev.name}</div>
                  <div className="event-item__meta">{ev.meta}</div>
                </div>
              ))}
            </div>

            {/* Engajamento */}
            <div className="engagement-card">
              <div className="engagement-card__icon">
                <ProtoIcon size={33} />
              </div>
              <div>
                <div className="engagement-card__level">Nível 3 — Engajado</div>
                <div className="engagement-card__points">67/100 pontos</div>
              </div>
              <div className="progress-wrap">
                <div className="progress-bar">
                  <div
                    className="progress-bar__fill"
                    style={{ width: '67%' }}
                  />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
