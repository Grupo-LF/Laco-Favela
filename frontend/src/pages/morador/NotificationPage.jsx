import React, { useState, useEffect } from 'react';
import '../../styles/pages/morador/NotificationPage.css';

const NotificationPage = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const familiaId = localStorage.getItem('familiaId') || 1;

  useEffect(() => {
    // Dados idênticos ao print do Figma caso a API não responda
    const loadMockData = () => {
      setNotifications([
        {
          id: 1,
          tipo: 'reuniao',
          titulo: 'Reunião da comunidade',
          mensagem: 'Amanhã às 18h no Centro Comunitário – Assunto: Melhorias na praça central e iluminação.',
          tempo_passado: 'Hoje, 09:14',
          lida: false
        },
        {
          id: 2,
          tipo: 'status',
          titulo: 'Status Atualizado',
          mensagem: 'Sua situação foi atualizada para Aprovado. Confira os detalhes em Acompanhamento.',
          tempo_passado: 'Ontem, 14:32',
          lida: false
        },
        {
          id: 3,
          tipo: 'acao',
          titulo: 'Nova Ação Disponível',
          mensagem: 'Uma nova ação da comunidade está disponível para você participar. Acesse Acompanhamento para saber mais.',
          tempo_passado: 'Ontem, 11:00',
          lida: false
        },
        {
          id: 4,
          tipo: 'palestra',
          titulo: 'Palestra: Direitos do Morador',
          mensagem: 'O evento vai ser realizado na praça central às 16h. Contamos com a sua participação!',
          tempo_passado: '3 dias atrás',
          lida: true
        },
        {
          id: 5,
          tipo: 'ranking',
          titulo: 'Você subiu no Ranking!',
          mensagem: 'Parabéns! Você alcançou o Nível 3 de engajamento na comunidade.',
          tempo_passado: '1 semana atrás',
          lida: true
        }
      ]);
    };

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/notificacoes/?familia=${familiaId}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          loadMockData();
        }
      } catch (error) {
        console.error("Erro ao buscar dados do backend, usando mock:", error);
        loadMockData(); 
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [familiaId]);

  const unreadCount = notifications.filter(n => !n.lida).length;

  const markAllAsRead = async () => {
    try {
      setNotifications(notifications.map(n => ({ ...n, lida: true })));
      
      await fetch(`http://localhost:8000/api/notificacoes/marcar-todas-lidas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familia: familiaId })
      });
    } catch (error) {
      console.error("Erro ao sincronizar leitura com o servidor:", error);
    }
  };

  const renderIcon = (tipo) => {
    switch (tipo) {
      case 'reuniao':
      case 'palestra':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
      case 'status':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
      case 'ranking':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
      default:
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
    }
  };

  return (
    <div className="notifications-container">
      <header className="noti-header-flex">
        <h2 className="noti-unread-title">
          {unreadCount > 0 ? `${unreadCount} mensagens não lidas` : 'Nenhuma mensagem nova'}
        </h2>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="noti-btn-read-all">
            Marcar todas como lidas
          </button>
        )}
      </header>

      <div className="noti-cards-list">
        {loading ? (
          <div className="noti-loading">Carregando notificações...</div>
        ) : (
          notifications.map(noti => (
            <div 
              key={noti.id} 
              className={`noti-card-item ${noti.lida ? 'noti-status-read' : 'noti-status-unread'}`}
            >
              <div className="noti-icon-wrapper">
                {renderIcon(noti.tipo)}
              </div>

              <div className="noti-text-block">
                <h3>{noti.titulo}</h3>
                <p>{noti.mensagem}</p>
                <span className="noti-time-stamp">{noti.tempo_passado}</span>
              </div>

              {!noti.lida && <div className="noti-blue-dot"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;