import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReactComponent as BlacktIcon } from '../../assets/Square_black.svg';
import { ReactComponent as WhiteIcon } from '../../assets/Square_white.svg';
import ApexCharts from 'apexcharts';
import axios from 'axios';
import { Icon } from 'react-material-symbols';

const Dashboard = () => {
  // ========== ESTADOS ==========
  const [statusCotas, setStatusCotas] = useState([]);
  const [cicloTitulo, setCicloTitulo] = useState('Carregando ciclo...');
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
      height: 300,
      responsive: [{
        breakpoint: 768,
        options: { chart: { height: 250 } }
      }]
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
      toolbar: { show: false },
      responsive: [{
        breakpoint: 768,
        options: { chart: { height: 280 } }
      }]
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
      offsetX: 10,
      style: { fontSize: '12px' }
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
        const res = await axios.get('http://localhost:8000/api/admin/dashboard/cotas/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });
        
        if (res.data) {
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
    if (donutRef.current && !donutChartRef.current) {
      donutChartRef.current = new ApexCharts(donutRef.current, donutOptions);
      donutChartRef.current.render();
    }

    if (rankingRef.current && !rankingChartRef.current) {
      rankingChartRef.current = new ApexCharts(rankingRef.current, rankingOptions);
      rankingChartRef.current.render();
    }

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

  const cards = [
    { titulo: 'FAMÍLIAS CADASTRADAS', valor: '487', subtitulo: '+30 famílias neste ciclo', icone: 'family_restroom' },
    { titulo: 'PRESIDENTES ATIVOS', valor: '12', subtitulo: 'Meta: 12', icone: 'groups' },
    { titulo: 'APROVAÇÕES PENDENTES', valor: '48', subtitulo: '10% do total', icone: 'pending_actions' },
    { titulo: 'FEEDBACKS PENDENTES', valor: '5', subtitulo: 'Requer atenção', icone: 'feedback' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '100%', overflowX: 'hidden' }}>
      
      {/* HEADER */}
      <div className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icon name="dashboard" size={32} style={{ color: 'var(--color-primary, #2f2f2f)' }} />
          <div>
            <h2 style={{ margin: 0, color: 'var(--color-primary, #2f2f2f)' }}>Dashboard Analítico</h2>
            <p style={{ margin: 0, color: '#666' }}>{cicloTitulo}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="file_export" size={18} />
            Exportar
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="refresh" size={18} />
            Novo ciclo
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {cards.map((card, index) => (
          <div className="card" key={index} style={{ position: 'relative', paddingLeft: '70px' }}>
            <Icon 
              name={card.icone} 
              size={36} 
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-primary, #2f2f2f)',
                opacity: 0.7
              }}
            />
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{card.titulo}</p>
            <h1 style={{ margin: '8px 0', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>{card.valor}</h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{card.subtitulo}</p>
          </div>
        ))}
      </div>

      {/* GRÁFICOS: BARRAS + DONUT */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Gráfico de Barras */}
        <div className="card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="bar_chart" size={20} style={{ color: 'var(--color-primary, #2f2f2f)' }} />
              <h3 style={{ margin: 0 }}>Participações por Mês</h3>
            </div>
            <span className="badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="schedule" size={14} />
              Último ciclo
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosParticipacoes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="familias" fill="#8884d8" name="Famílias" />
              <Bar dataKey="eventos" fill="#82ca9d" name="Eventos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico Donut */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Icon name="donut_large" size={20} style={{ color: 'var(--color-primary, #2f2f2f)' }} />
            <h3 style={{ margin: 0 }}>Distribuição por Perfil</h3>
          </div>
          <div ref={donutRef}></div>
        </div>
      </div>

      {/* RANKING + STATUS DE COTAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {/* Ranking */}
        <div className="card">
          <div ref={rankingRef}></div>
        </div>

        {/* Status de Cotas */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Icon name="assignment_turned_in" size={20} style={{ color: 'var(--color-primary, #2f2f2f)' }} />
            <h3 style={{ margin: 0 }}>Status de Cotas</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>Progresso por presidente</p>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#999' }}>Carregando...</p>
          ) : statusCotas && statusCotas.length > 0 ? (
            statusCotas.map((item, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name="person" size={16} style={{ color: '#666' }} />
                    <strong>{item.nome}</strong>
                  </div>
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
  );
};

export default Dashboard;