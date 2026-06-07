import React, { useState } from 'react';
import "C:/CC_local/projetos/LACO_FAVELAP2/Laco-Favela/frontend/src/styles/pages/morador/NotificationPage.css"
const NotificationPage = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Manutenção', message: 'O elevador passará por manutenção amanhã.', read: false },
    { id: 2, title: 'Assembleia', message: 'Assembleia geral marcada para o dia 20.', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="notifications-content">
      <header className="notifications-header">
        <h1>Notificações</h1>
        <div className="header-actions">
          <span>{unreadCount} não lidas</span>
          <button onClick={markAllAsRead} className="btn-mark-read">
            Marcar todas como lidas
          </button>
        </div>
      </header>

      <div className="notifications-list">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
          </div>
        ))}
      </div>

      <button className="btn-back" onClick={() => onNavigate('home')}>
        Voltar para Home
      </button>
    </div>
  );
};

export default NotificationPage;