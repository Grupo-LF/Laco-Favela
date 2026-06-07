import React, { useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReactComponent as BlacktIcon } from '../../assets/Square_black.svg';
import { ReactComponent as WhiteIcon } from '../../assets/Square_white.svg';
import ApexCharts from 'apexcharts';

const Dashboard = () => {
  // ========== DADOS ==========
  const dadosParticipacoes = [
    { mes: 'Jan', familias: 120, eventos: 45 },
    { mes: 'Fev', familias: 150, eventos: 60 },
    { mes: 'Mar', familias: 180, eventos: 75 },
    { mes: 'Abr', familias: 220, eventos: 90 },
    { mes: 'Mai', familias: 260, eventos: 110 },
  ];

  const statusCotas = [
    { nome: 'Nome 1', atual: 48, meta: 50, percentual: 96 },
    { nome: 'Nome 2', atual: 45, meta: 50, percentual: 90 },
    { nome: 'Nome 3', atual: 50, meta: 50, percentual: 100 },
    { nome: 'Nome 4', atual: 31, meta: 50, percentual: 62 },
    { nome: 'Nome 5', atual: 22, meta: 50, percentual: 44 },
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
    { titulo: 'FAMÍLIAS CADASTRADAS', valor: '487', subtitulo: '+30 famílias neste ciclo' },
    { titulo: 'PRESIDENTES ATIVOS', valor: '12', subtitulo: 'Meta: 12' },
    { titulo: 'APROVAÇÕES PENDENTES', valor: '48', subtitulo: '10% do total' },
    { titulo: 'FEEDBACKS PENDENTES', valor: '5', subtitulo: 'Requer atenção' }
  ];

  return (
    <div>

      <div className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard Analítico</h2>
          <p style={{ margin: 0, color: '#666' }}>Ciclo 1 - Mês 6</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-outline">Exportar</button>
          <button className="btn btn-primary">Novo ciclo</button>
        </div>
      </div>

      <div style={{ padding: '20px', maxWidth: '100%', overflowX: 'hidden' }}>

        {/* CARDS - Responsivo com wrap */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {cards.map((card, index) => (
            <div className="card" key={index}>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{card.titulo}</p>
              <h1 style={{ margin: '8px 0', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>{card.valor}</h1>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{card.subtitulo}</p>
            </div>
          ))}
        </div>

        {/* GRÁFICO DE BARRAS + DONUT - Responsivo */}
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
              <h3 style={{ margin: 0 }}>Participações por Mês</h3>
              <span className="badge">Último ciclo</span>
            </div>
            <ResponsiveContainer width="110%" height={300} barCategoryGap={window.innerWidth < 768 ? 10 : 20} style={{ marginLeft: '-10%' }}>
              <BarChart
                data={dadosParticipacoes}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10
                }}
                barGap={108}
                barCategoryGap={200}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                  vertical={false}
                />
                <XAxis
                  dataKey="mes"
                  tick={{
                    fill: 'var(--text-secondary)',
                    fontSize: 12
                  }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: 'var(--text-secondary)',
                    fontSize: 12
                  }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    border: `1px solid var(--border-color)`,
                    borderRadius: 'var(--border-radius-md)',
                    color: 'var(--text-primary)'
                  }}
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: '12px',
                    paddingTop: '10px',
                    color: 'var(--text-primary)'
                  }}
                  iconType="circle"
                />
                <Bar
                  dataKey="familias"
                  fill="var(--color-primary)"
                  name="Famílias"
                  radius={[8, 8, 0, 0]}
                  barSize={window.innerWidth < 768 ? 25 : 40}
                // background REMOVIDO - não tem mais fundo cinza
                />
                <Bar
                  dataKey="eventos"
                  fill="var(--color-accent)"
                  name="Eventos"
                  radius={[8, 8, 0, 0]}
                  barSize={window.innerWidth < 768 ? 25 : 40}
                // background REMOVIDO - não tem mais fundo cinza
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico Donut */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Distribuição por Perfil</h3>
            <div ref={donutRef}></div>
          </div>
        </div>

        {/* RANKING + STATUS DE COTAS - Responsivo */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {/* Ranking */}
          <div className="card">
            <div ref={rankingRef} style={{ overflowX: 'auto' }}></div>
          </div>

          {/* Status de Cotas */}
          <div className="card">
            <h3 style={{ marginBottom: '8px' }}>Status de Cotas</h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>Progresso por presidente</p>

            {statusCotas.map((item, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
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