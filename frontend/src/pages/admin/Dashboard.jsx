import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReactComponent as BlacktIcon } from '../../assets/Square_black.svg';
import { ReactComponent as WhiteIcon } from '../../assets/Square_white.svg';
import ApexCharts from 'apexcharts';
import axios from 'axios';

const Dashboard = () => {
  // ========== ESTADOS ==========
  const [statusCotas, setStatusCotas] = useState([]);
  const [cicloTitulo, setCicloTitulo] = useState('Carregando ciclo...'); // NOVO: Estado para o ciclo das cotas
  const [loading, setLoading] = useState(true);

  // ========== DADOS ==========
  const dadosParticipacoes = [
    { mes: 'Jan', familias: 120, eventos: 45 },
    { mes: 'Fev', familias: 150, eventos: 60 },
    { mes: 'Mar', familias: 180, eventos: 75 },
    { mes: 'Abr', familias: 220, eventos: 90 },
    { mes: 'Mai', familias: 260, eventos: 110 },
  ];

  // ========== CONFIGURAÇÃO DOS GRÁFICOS APEX ==========
  const donutOptions = {
    series: [44, 55, 13, 33],
    chart: {
      type: 'donut',
      height: 300
    },
    labels: ['Mães solo', '+3 filhos', 'Renda baixa', 'Idosos'],
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    dataLabels: { enabled: false },
    legend: {
      position: 'bottom',
      fontSize: '12px'
    },
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
              formatter: (w) => {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
              }
            }
          }
        }
      }
    }
  };

  const rankingOptions = {
    series: [{
      name: 'Visitas',
      data: [48, 45, 40, 35, 30]
    }],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val} visitas`,
      offsetX: 10
    },
    xaxis: {
      categories: ['Presidente 1', 'Presidente 2', 'Presidente 3', 'Presidente 4', 'Presidente 5']
    },
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

  // ========== CARREGAR DADOS DE COTAS ==========
  useEffect(() => {
    async function carregarCotas() {
      try {
        setLoading(true);
        // NOVO: Adicionado o header de Authorization para não dar erro de permissão na API
        const res = await axios.get('http://localhost:8000/api/admin/dashboard/cotas/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });
        
        if (res.data) {
          // NOVO: Pega o título do ciclo ativo referente a essas cotas
          if (res.data.ciclo) setCicloTitulo(res.data.ciclo);
          if (res.data.cotas) setStatusCotas(res.data.cotas);
        }
      } catch (err) {
        console.error('Erro ao carregar cotas:', err);
        setStatusCotas([]);
      } finally {
        setLoading(false);
      }
    }
    carregarCotas();
  }, []);

  // ========== INICIALIZAR GRÁFICOS ==========
  useEffect(() => {
    // Donut Chart
    if (donutRef.current && !donutChartRef.current) {
      donutChartRef.current = new ApexCharts(donutRef.current, donutOptions);
      donutChartRef.current.render();
    }

    // Ranking Chart
    if (rankingRef.current && !rankingChartRef.current) {
      rankingChartRef.current = new ApexCharts(rankingRef.current, rankingOptions);
      rankingChartRef.current.render();
    }

    // Cleanup
    return () => {
      if (donutChartRef.current) {
        donutChartRef.current.destroy();
        donutChartRef.current = null;
      }
      if (rankingChartRef.current) {
        rankingChartRef.current.destroy();
        rankingChartRef.current = null;
      }
    };
  }, []);

  return (
    <div>
    <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard Analítico</h2>
          {/* NOVO: Exibe o nome real do ciclo das cotas que está rodando no momento */}
          <p style={{ margin: 0, color: '#666' }}>{cicloTitulo}</p>
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
          <h1 style={{ margin: '8px 0', fontSize: '2.5rem' }}>487</h1>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>+30 famílias neste ciclo</p>
        </div>
        <div className="card">
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>PRESIDENTES ATIVOS</p>
          <h1 style={{ margin: '8px 0', fontSize: '2.5rem' }}>12</h1>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Meta: 12</p>
        </div>
        <div className="card">
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>APROVAÇÕES PENDENTES</p>
          <h1 style={{ margin: '8px 0', fontSize: '2.5rem' }}>48</h1>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>10% do total</p>
        </div>
        <div className="card">
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>FEEDBACKS PENDENTES</p>
          <h1 style={{ margin: '8px 0', fontSize: '2.5rem' }}>5</h1>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Requer atenção</p>
        </div>
      </div>

      {/* GRÁFICO DE BARRAS + DONUT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* Gráfico de Barras */}
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

        {/* Gráfico Donut */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Distribuição por Perfil</h3>
          <div ref={donutRef}></div>
        </div>
      </div>

      {/* RANKING + STATUS DE COTAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {/* Ranking */}
        <div className="card">
          <div ref={rankingRef}></div>
        </div>

        {/* Status de Cotas */}
        <div className="card">
          <h3 style={{ marginBottom: '8px' }}>Status de Cotas</h3>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>Progresso por presidente</p>
          
          {loading ? (
            <p style={{ textAlign: 'center', color: '#999' }}>Carregando...</p>
          ) : statusCotas && statusCotas.length > 0 ? (
            statusCotas.map((item, index) => (
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
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#999' }}>Nenhum dado disponível</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;