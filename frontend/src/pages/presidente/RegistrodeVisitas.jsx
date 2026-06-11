// pages/presidente/RegistrodeVisitas.jsx
// Apenas o conteúdo da página — sidebar e layout já são fornecidos pelo AppPresidente.js

import { useState } from "react";
import "../../styles/pages/presidente/RegistrodeVisitas.css";

// ── Ícones ──────────────────────────────────────────────────────────────────

const IconSync = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <polyline points="23 20 23 14 17 14" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>
);

const IconOffline = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
    <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

const IconComForm = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 7h6M9 11h6M9 15h4" />
  </svg>
);

const IconSemForm = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 7h6M9 11h4" />
    <line x1="16" y1="17" x2="20" y2="21" />
    <line x1="20" y1="17" x2="16" y2="21" />
  </svg>
);

const IconCheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconCloud = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

// ── Dados ────────────────────────────────────────────────────────────────────

const STATS = [
  { icon: <IconSync />,    label: "Sincronizadas", value: 16 },
  { icon: <IconOffline />, label: "Offline",        value: 2  },
  { icon: <IconComForm />, label: "Com Formulário", value: 12 },
  { icon: <IconSemForm />, label: "Sem Formulário", value: 6  },
];

const VISITS = [
  { id: 1, name: "Família Santos",   meta: "Hoje, 09:30 • Formulário enviado",  status: "synced"  },
  { id: 2, name: "Família Oliveira", meta: "Ontem, 15:20 • Salvo offline",       status: "offline" },
  { id: 3, name: "Família Rodrigues",meta: "Ontem, 10:15 • Formulário enviado",  status: "synced"  },
  { id: 4, name: "Família Fereira",  meta: "Ontem, 11:20 • Formulário enviado",  status: "synced"  },
  { id: 5, name: "Família Silva",    meta: "Ontem, 12:20 • Salvo offline",        status: "offline" },
];

// ── Sub-componentes ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value }) {
  return (
    <div className="rv-stat-card">
      <div className="rv-stat-card__icon">{icon}</div>
      <div className="rv-stat-card__label">{label}</div>
      <div className="rv-stat-card__value">{value}</div>
    </div>
  );
}

function VisitItem({ visit }) {
  const synced = visit.status === "synced";
  return (
    <div className="rv-visit-item">
      <div className={`rv-visit-item__icon ${synced ? "rv-visit-item__icon--synced" : "rv-visit-item__icon--offline"}`}>
        {synced ? <IconCheckCircle /> : <IconCloud />}
      </div>
      <div className="rv-visit-item__info">
        <div className="rv-visit-item__name">{visit.name}</div>
        <div className="rv-visit-item__meta">{visit.meta}</div>
      </div>
      <span className={`rv-badge ${synced ? "rv-badge--synced" : "rv-badge--offline"}`}>
        {synced ? "Sincronizado" : "Offline"}
      </span>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function RegistrodeVisitas() {
  return (
    <div className="rv-page">

      {/* Cabeçalho */}
      <div className="rv-header">
        <div className="rv-header__text">
          <h1 className="rv-header__title">Registros de Visitas</h1>
          <p className="rv-header__subtitle">
            <strong>18</strong> famílias visitadas em Maio/2026
          </p>
        </div>
        <button className="rv-btn-nova">
          Nova Visita
          <span className="rv-btn-nova__plus">+</span>
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="rv-stats-grid">
        {STATS.map((s, i) => (
          <StatCard key={i} icon={s.icon} label={s.label} value={s.value} />
        ))}
      </div>

      {/* Histórico */}
      <div className="rv-historico">
        <h2 className="rv-historico__title">Histórico de Visitas – Maio/26</h2>
        <div className="rv-visit-list">
          {VISITS.map(v => <VisitItem key={v.id} visit={v} />)}
        </div>
      </div>

    </div>
  );
}