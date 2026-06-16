import React, { useState, useEffect } from 'react';
import '../../styles/pages/morador/HomePage.css';

const HomePage = ({ onNavigate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Dados fiéis ao Figma caso o back-end não responda
    const loadMockData = () => {
      setData({
        usuario: {
          nome: "Pedro"
        },
        eventos: [
          {
            id: 1, 
            titulo: "Reunião Comunitária", 
            data_detalhe: "11/06/2026 - 18h no Centro Comunitário de Fitilho"
          },
          {
            id: 2, 
            titulo: "Ação para Crianças", 
            data_detalhe: "18/06/2026 - 16h na Praça Central Laço"
          }
        ],
        engajamento_nivel: "Nível 3 - Engajado",
        engajamento_pontos: "67/100 pontos",
        engajamento_porcentagem: 67
      });
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://127.0.0.1:8000/api/dashboard/');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          loadMockData();
        }
      } catch (err) {
        console.error("Erro ao buscar dados do servidor, usando mock:", err);
        loadMockData(); // Ativa os dados do Figma se o Django estiver desligado
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-state">Carregando painel...</div>;

  return (
    <div className="home-container">
      {/* Título de Boas-vindas */}
      <h1 className="welcome-title">Olá, {data?.usuario?.nome || 'Pedro'}!</h1>

      {/* Seção 1: Acesso Rápido */}
      <section className="quick-access-section">
        <h2>Acesso Rápido</h2>
        <div className="quick-access-grid">
          
          <div className="access-card" onClick={() => onNavigate('acompanhamento')}>
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Acompanhamento</span>
          </div>

          <div className="access-card" onClick={() => onNavigate('ranking')}>
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>Ranking</span>
          </div>

          <div className="access-card" onClick={() => onNavigate('feedback')}>
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <path d="M12 7v5M12 16h.01"/>
            </svg>
            <span>Feedback Anônimo</span>
          </div>

          <div className="access-card" onClick={() => onNavigate('ser-presidente')}>
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Ser Presidente</span>
          </div>

        </div>
      </section>

      {/* Seção 2: Dois Cards Inferiores */}
      <div className="dashboard-bottom-flex">
        
        {/* Card: Próximos Eventos */}
        <div className="info-box events-box">
          <h3>Próximos Eventos</h3>
          <div className="events-list">
            {data?.eventos && data.eventos.length > 0 ? (
              data.eventos.map((e, index) => (
                <div key={e.id || index} className={`event-item color-${(index % 2) === 0 ? 'orange' : 'blue'}`}>
                  <span className="event-name">{e.titulo || e.nome}</span>
                  <span className="event-date">{e.data_detalhe || 'Data a definir'}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">Nenhum evento programado.</div>
            )}
          </div>
        </div>

        {/* Card: Engajamento */}
        <div className="info-box engagement-box">
          <h3>Engajamento</h3>
          <div className="engagement-content">
            <svg className="tree-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M12 5l-4 4M12 5l4 4M5 19h14"/>
            </svg>
            
            <span className="level-text">{data?.engajamento_nivel || 'Nível 3 - Engajado'}</span>
            <span className="points-subtext">{data?.engajamento_pontos || '67/100 pontos'}</span>
            
            {/* Barra de Progresso */}
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${data?.engajamento_porcentagem || 67}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;