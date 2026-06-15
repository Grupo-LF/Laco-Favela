import React, { useState, useEffect } from 'react';
import '../../styles/pages/morador/NotificationPage.css';

const NotificationPage = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recupera o ID do morador logado (ajuste a chave conforme o sistema de login)
  const familiaId = localStorage.getItem('familiaId') || 1; 

  // Função para carregar as notificações do Backend
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/notificacoes/?familia=${familiaId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Erro ao buscar notificações do backend:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados assim que o componente é montado em tela
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filtra as notificações não lidas baseando-se no campo 'lida' do Django
  const unreadCount = notifications.filter(n => !n.lida).length;

  // Função para marcar todas como lidas na API e atualizar a tela
  const markAllAsRead = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/notificacoes/marcar-todas-lidas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ familia: familiaId })
      });

      if (response.ok) {
        // Atualiza o estado local para dizer que todas estão lidas instantaneamente
        setNotifications(notifications.map(n => ({ ...n, lida: true })));
      }
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
    }
  };

  return (
    <div className="notifications-content">
      <header className="notifications-header">
        <h1>Notificações</h1>
        <div className="header-actions">
          <span>{unreadCount} {unreadCount === 1 ? 'não lida' : 'não lidas'}</span>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn-mark-read">
              Marcar todas como lidas
            </button>
          )}
        </div>
      </header>

      <div className="notifications-list">
        {loading ? (
          <p>Carregando notificações...</p>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.lida ? 'read' : 'unread'}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{notification.titulo}</h3>
                {/* Exibe o tempo formatado pelo Serializer (Ex: "Hoje, 14:32") */}
                <span style={{ fontSize: '12px', color: '#888' }}>{notification.tempo_passado}</span>
              </div>
              <p>{notification.mensagem}</p>
            </div>
          ))
        )}

        {!loading && notifications.length === 0 && (
          <p style={{ textAlign: 'center', color: '#777', padding: '20px' }}>
            Nenhuma notificação encontrada para o seu perfil.
          </p>
        )}
      </div>

      <button className="btn-back" onClick={() => onNavigate('home')}>
        Voltar para Home
      </button>
    </div>
  );
};

export default NotificationPage;