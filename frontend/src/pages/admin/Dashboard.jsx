import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReactComponent as BlacktIcon } from '../../assets/Square_black.svg';
import { ReactComponent as WhiteIcon } from '../../assets/Square_white.svg';
import ApexCharts from 'apexcharts';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Dashboard = () => {
  const [dadosGerais, setDadosGerais] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/dados-gerais/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => setDadosGerais(data))
      .catch(err => console.error(err));
  }, []);

  // ========== DADOS MOCKADOS (substituir futuramente) ==========
  const dadosParticipacoes = [
    { mes: 'Jan', familias: 120, eventos: 45 },
    { mes: 'Fev', familias: 150, eventos: 60 },
    { mes: 'Mar', familias: 180, eventos: 75 },
    { mes: 'Abr', familias: 220, eventos: 90 },
    { mes: 'Mai', familias: 260, eventos: 110 },
  ];

  // ========== CONFIGURAÇÃO DOS GRÁFICOS APEX ==========
  const rankingData = dadosGerais
    ? dadosGerais.familias_por_presidente.slice(0, 5).map(p => p.quantidade_familias)
    : [0, 0, 0, 0, 0];

  const rankingCategorias = dadosGerais
    ? dadosGerais.familias_por_presidente.slice(0, 5).map(p => p.nome)
    : ['', '', '', '', ''];

  const donutOptions = {
    series: [44, 55, 13, 33],
    chart: { type: 'donut', height: 300 },
    labels: ['Mães solo', '+3 filhos', 'Renda baixa', 'Idosos'],
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    dataLabels: { enabled: false },
    legend: { position: 'bottom', fontSize: '12px' },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
            }
          }
        }
      }
    }
  };

  const rankingOptions = {
    series: [{ name: 'Famílias', data: rankingData }],
    chart: { type: 'bar', height: 350, toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: true } },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val} famílias`,
      offsetX: 10
    },
    xaxis: { categories: rankingCategorias },
    title: {
      text: 'Ranking de Presidentes',
      align: 'left',
      style: { fontSize: '16px', fontWeight: 'bold' }
    }
  };

  // ========== REFERÊNCIAS ==========
  const donutRef = useRef(null);
  const rankingRef = useRef(null);
  const donutChartRef = useRef(null);
  const rankingChartRef = useRef(null);

  // ========== INICIALIZAR GRÁFICOS ==========
  useEffect(() => {
    if (donutRef.current && !donutChartRef.current) {
      donutChartRef.current = new ApexCharts(donutRef.current, donutOptions);
      donutChartRef.current.render();
    }
    if (rankingRef.current && !rankingChartRef.current) {
      rankingChartRef.current = new ApexCharts(rankingRef.current, rankingOptions);
      rankingChartRef.current.render();
    }
    return () => {
      if (donutChartRef.current) { donutChartRef.current.destroy(); donutChartRef.current = null; }
      if (rankingChartRef.current) { rankingChartRef.current.destroy(); rankingChartRef.current = null; }
    };
  }, [dadosGerais]);

  // ========== STATUS DE COTAS ==========
  const statusCotas = dadosGerais
    ? dadosGerais.familias_por_presidente.map(p => ({
        nome: p.nome,
        atual: p.quantidade_familias,
        meta: 50,
        percentual: Math.min((p.quantidade_familias / 50) * 100, 100)
      }))
    : [];

  return (
    <div>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard Analítico</h2>
          <p style={{ margin: 0, color: '#666' }}>Ciclo 1 - Mês 6</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline">Exportar</button>
          <button className="btn btn-primary">Novo ciclo</button>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="card">
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>FAMÍLIAS CADASTRADAS</p>
            <h1 style={{ margin: '8px 0', fontSize: '2.5rem' }}>
              {dadosGerais ? dadosGerais.total_familias : '...'}
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Total no sistema</p>
          </div>
          <div className="card">
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>PESSOAS ALCANÇADAS</p>
            <h1 style={{ margin: '8px 0', fontSize: '2.5rem' }}>
              {dadosGerais ? dadosGerais.total_pessoas : '...'}
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Total de membros</p>
          </div>
          <div className="card">
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>PRESIDENTES ATIVOS</p>
            <h1 style={{ margin: '8px 0', fontSize: '2.5rem' }}>
              {dadosGerais ? dadosGerais.familias_por_presidente.length : '...'}
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Com famílias cadastradas</p>
          </div>
          <div className="card">
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>COMUNIDADES</p>
            <h1 style={{ margin: '8px 0', fontSize: '2.5rem' }}>
              {dadosGerais ? dadosGerais.familias_por_comunidade.length : '...'}
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Comunidades atendidas</p>
          </div>
        </div>

        {/* GRÁFICO DE BARRAS + DONUT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Participações por Mês</h3>
              <span className="badge">Último ciclo</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosParticipacoes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="familias" fill="#8884d8" name="Famílias" />
                <Bar dataKey="eventos" fill="#82ca9d" name="Eventos" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Distribuição por Perfil</h3>
            <div ref={donutRef}></div>
          </div>
        </div>

        {/* RANKING + STATUS DE COTAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div className="card">
            <div ref={rankingRef}></div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '8px' }}>Status de Cotas</h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>Progresso por presidente</p>
            {statusCotas.length === 0 && <p style={{ color: '#999' }}>Nenhum dado disponível</p>}
            {statusCotas.map((item, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong>{item.nome}</strong>
                  <span>{item.atual}/{item.meta}</span>
                </div>
                <div style={{ background: '#e0e0e0', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                  <div style={{
                    background: '#2f2f2f',
                    height: '100%',
                    width: `${item.percentual}%`,
                    borderRadius: '10px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;