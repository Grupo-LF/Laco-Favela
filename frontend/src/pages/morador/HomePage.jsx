import React, { useState, useEffect } from 'react';
import '../../styles/pages/morador/HomePage.css';

const HomePage = ({ onNavigate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        if (!response.ok) throw new Error('Falha ao carregar dados');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="home-layout">
      <aside className="sidebar">
        <nav>
          <button onClick={() => onNavigate('home')}>Início</button>
          <button onClick={() => onNavigate('reservas')}>Reservas</button>
          <button onClick={() => onNavigate('visitantes')}>Visitantes</button>
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <h1>Olá, {data.usuario.nome}</h1>
        </header>
        <section className="content">
          <div className="greeting">
            <p>Bem-vindo ao seu condomínio digital.</p>
          </div>
          <div className="quick-access">
            <div className="card" onClick={() => onNavigate('cota')}>
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              <span>Cota: {data.cota.status}</span>
            </div>
            <div className="card" onClick={() => onNavigate('formularios')}>
              <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" /></svg>
              <span>Formulários ({data.formularios.length})</span>
            </div>
          </div>
          <div className="events-card">
            <h3>Próximos Eventos</h3>
            <ul>{data.eventos.map(e => <li key={e.id}>{e.titulo}</li>)}</ul>
          </div>
          <div className="engagement-card">
            <h3>Engajamento</h3>
            <p>Sua participação nas assembleias: {data.engajamento}%</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;