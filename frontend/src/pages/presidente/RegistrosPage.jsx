import { useState } from "react";

const ACCENT = "#F5C800";
const SIDEBAR_BG = "#2C2C2C";
const SIDEBAR_TEXT = "#E0E0E0";
const SIDEBAR_MUTED = "#A0A0A0";
const SIDEBAR_ACTIVE_BG = "#F5C800";
const SIDEBAR_ACTIVE_TEXT = "#1A1A1A";

const visits = [
  { id: 1, family: "Família Santos",   time: "Hoje, 09:30",    detail: "Formulário enviado", status: "sincronizado" },
  { id: 2, family: "Família Oliveira", time: "Ontem, 15:20",   detail: "Salvo offline",       status: "offline"      },
  { id: 3, family: "Família Rodrigues",time: "Ontem, 10:15",   detail: "Formulário enviado", status: "sincronizado" },
  { id: 4, family: "Família Ferreira", time: "Ontem, 11:20",   detail: "Formulário enviado", status: "sincronizado" },
  { id: 5, family: "Família Silva",    time: "Ontem, 12:20",   detail: "Salvo offline",       status: "offline"      },
];

const navItems = [
  { label: "Home",          icon: "🏠", section: "PRINCIPAL"   },
  { label: "Famílias",      icon: "👥", section: null           },
  { label: "Formulários",   icon: "📋", section: null           },
  { label: "Registros",     icon: "📁", section: null, active: true },
  { label: "Meu indicador", icon: "📊", section: "DESEMPENHO"  },
  { label: "Ranking",       icon: "🏆", section: null           },
];

function StatusBadge({ status }) {
  const isSynced = status === "sincronizado";
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.04em",
      padding: "4px 10px",
      borderRadius: 20,
      background: isSynced ? "#1A1A1A" : "#E8E8E8",
      color: isSynced ? "#F5C800" : "#666",
      whiteSpace: "nowrap",
      textTransform: "uppercase",
    }}>
      {isSynced ? "Sincronizado" : "Offline"}
    </span>
  );
}

function FamilyIcon() {
  return (
    <div style={{
      width: 36, height: 36,
      background: "#1A1A1A",
      borderRadius: 8,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="3" fill="#F5C800" opacity="0.15"/>
        <path d="M3 3l18 18M3 21L21 3" stroke="#F5C800" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{
      background: "#F7F7F5",
      borderRadius: 12,
      padding: "16px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 3l18 18M3 21L21 3" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "#999", textTransform: "uppercase" }}>
          {label}
        </span>
      </div>
      <span style={{ fontSize: 28, fontWeight: 700, color: "#1A1A1A", lineHeight: 1 }}>{value}</span>
    </div>
  );
}

function NavItem({ item, onClick, isActive }) {
  return (
    <>
      {item.section && (
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "#666",
          textTransform: "uppercase",
          padding: "18px 20px 6px",
        }}>
          {item.section}
        </div>
      )}
      <div
        onClick={() => onClick(item.label)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          margin: "2px 8px",
          borderRadius: 10,
          cursor: "pointer",
          background: isActive ? SIDEBAR_ACTIVE_BG : "transparent",
          color: isActive ? SIDEBAR_ACTIVE_TEXT : SIDEBAR_TEXT,
          fontWeight: isActive ? 700 : 400,
          fontSize: 14,
          transition: "background 0.15s",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="3"
            fill={isActive ? "#1A1A1A" : "none"}
            stroke={isActive ? "#1A1A1A" : "#666"}
            strokeWidth="1.5"/>
          <path d="M6 6l12 12M6 18L18 6"
            stroke={isActive ? ACCENT : "#666"}
            strokeWidth="1.5"
            strokeLinecap="round"/>
        </svg>
        {item.label}
      </div>
    </>
  );
}

export default function RegistrosPage() {
  const [activeNav, setActiveNav] = useState("Registros");

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#F0EFE9",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 200,
        background: SIDEBAR_BG,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        paddingBottom: 24,
      }}>
        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px 20px 20px",
        }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: "50%",
            background: "#3C3C3C",
            border: "2px solid #555",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: SIDEBAR_MUTED,
            fontSize: 13,
            fontWeight: 500,
          }}>
            Logo
          </div>
        </div>

        {/* Profile */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 16px 20px",
          borderBottom: "1px solid #3A3A3A",
          marginBottom: 8,
        }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: "50%",
            background: ACCENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#1A1A1A",
            flexShrink: 0,
          }}>
            NS
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: SIDEBAR_TEXT, lineHeight: 1.3 }}>
              Nome e Sobrenome
            </div>
            <div style={{ fontSize: 11, color: SIDEBAR_MUTED }}>Presidente</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              isActive={activeNav === item.label}
              onClick={setActiveNav}
            />
          ))}
        </nav>

        {/* Sair */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 24px",
          color: SIDEBAR_MUTED,
          fontSize: 14,
          cursor: "pointer",
          borderTop: "1px solid #3A3A3A",
          marginTop: 8,
          paddingTop: 16,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
              stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sair
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        background: "#FAFAF8",
        padding: "36px 40px",
        overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 32,
        }}>
          <div>
            <h1 style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#1A1A1A",
              margin: 0,
              lineHeight: 1.2,
            }}>
              <span style={{
                background: ACCENT,
                padding: "0 4px",
                borderRadius: 3,
                marginRight: 4,
              }}>
                Registros
              </span>
              de Visitas
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#888" }}>
              18 famílias visitadas em Maio/2026
            </p>
          </div>
          <button style={{
            background: "#1A1A1A",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            letterSpacing: "0.02em",
          }}>
            Nova Visita
            <span style={{
              background: ACCENT,
              color: "#1A1A1A",
              borderRadius: 4,
              width: 20, height: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
              fontWeight: 700,
              lineHeight: 1,
            }}>+</span>
          </button>
        </div>

        {/* Stat cards */}
        <div style={{
          display: "flex",
          gap: 12,
          marginBottom: 32,
        }}>
          <StatCard label="Sincronizadas" value="16" />
          <StatCard label="Offline"        value="2"  />
          <StatCard label="Com formulário" value="12" />
          <StatCard label="Sem formulário" value="6"  />
        </div>

        {/* Visit history */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: "24px 28px",
          border: "1px solid #EBEBEB",
        }}>
          <h2 style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1A1A1A",
            margin: "0 0 20px",
            letterSpacing: "0.01em",
          }}>
            Histórico de Visitas — Maio/26
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visits.map((v) => (
              <div
                key={v.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "#F7F7F5",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#F0EFE7"}
                onMouseLeave={e => e.currentTarget.style.background = "#F7F7F5"}
              >
                <FamilyIcon />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
                    {v.family}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                    {v.time} · {v.detail}
                  </div>
                </div>
                <StatusBadge status={v.status} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
