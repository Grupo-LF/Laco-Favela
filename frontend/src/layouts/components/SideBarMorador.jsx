import { useState } from 'react';
import './HomePage.css';

const ProtoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: ProtoIcon },
  { id: 'notifications', label: 'Notificações', icon: ProtoIcon },
  { id: 'settings', label: 'Configurações', icon: ProtoIcon }
];

export default function Sidebar() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div className="sidebar">
      <div className="sidebar__logo-wrap">
        <div className="sidebar__logo">Logo</div>
      </div>
      
      <div className="sidebar__profile">
        <div className="avatar"></div>
        <div className="name">Usuário</div>
      </div>

      <nav>
        {NAV.map((item) => (
          <div 
            key={item.id} 
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => setActiveNav(item.id)}
          >
            <item.icon />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar__footer">
        Sair
      </div>
    </div>
  );
}
