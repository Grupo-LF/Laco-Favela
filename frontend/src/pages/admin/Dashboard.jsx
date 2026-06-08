import React, { useEffect, useRef } from 'react';
import { ReactComponent as AddIcon } from '../../assets/addBtn.svg';
import { ReactComponent as ExportIcon } from '../../assets/file_export.svg';
import ApexCharts from 'apexcharts';

const Dashboard = () => {
  // ========== DADOS ==========
  const dadosParticipacoes = [
    { mes: 'Janeiro', familias: 320, eventos: 85 },
    { mes: 'Fevereiro', familias: 260, eventos: 85 },
    { mes: 'Março', familias: 320, eventos: 90 },
    { mes: 'Abril', familias: 300, eventos: 85 },
  ];

  const statusCotas = [
    { nome: 'Maria Costa', atual: 48, meta: 50, percentual: 96 },
    { nome: 'Ana Lima', atual: 45, meta: 50, percentual: 90 },
    { nome: 'André Alves', atual: 50, meta: 50, percentual: 100 },
    { nome: 'Felipe Ramos', atual: 31, meta: 50, percentual: 62 },
  ];

  // ========== CONFIGURAÇÃO DOS GRÁFICOS APEX ==========

  // Gráfico de Barras (Participações por Mês)
  const barChartOptions = {
    series: [
      {
        name: 'Famílias presentes',
        data: dadosParticipacoes.map(item => item.familias),
        color: '#005E94'
      },
      {
        name: 'Eventos',
        data: dadosParticipacoes.map(item => item.eventos),
        color: '#F5A623'
      }
    ],
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false },
      responsive: [{
        breakpoint: 768,
        options: { chart: { height: 250 } }
      }]
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        borderRadiusApplication: 'end',
        horizontal: false,
        columnWidth: '60%',
        barGap: '20%',
        distributed: false,
      }
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: true,
      borderColor: '#d9d9d9',
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true, color: '#d9d9d9' } }
    },
    xaxis: {
      categories: dadosParticipacoes.map(item => item.mes),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        show: true,
        style: { fontSize: '14px', fontWeight: 500 }
      }
    },
    yaxis: {
      show: true,
      labels: { show: true },
      title: { text: '' }
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val}`
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '12px',
      markers: { radius: 12, width: 12, height: 12 },
      itemMargin: { horizontal: 15, vertical: 0 }
    },
    title: {
      text: undefined
    },
    colors: ['#005E94', '#F5A623']
  };

  // Gráfico Donut
  const donutOptions = {
    series: [44, 55, 13, 33],
    chart: {
      type: 'donut',
      height: 250,
      responsive: [{
        breakpoint: 768,
        options: { chart: { height: 250 } }
      }]
    },
    labels: ['Mães solo', '+3 filhos', 'Renda baixa', 'Idosos'],
    colors: ['#035A8F', '#599DC7', '#297CAE', '#026FB2'],
    dataLabels: { enabled: false },
    legend: {
      position: 'bottom',
      fontSize: '12px'
    },
    plotOptions: {
      pie: {
        donut: {
          size: "45%"
        }
      }
    }
  };

  // Gráfico Ranking - SEM LABEL DEBAIXO E SEM SCROLL
  const rankingOptions = {
    series: [{
      name: 'Visitas',
      data: [48, 45, 40, 35, 30]
    }],
    colors: [
      "var(--color-primary)",
      "var(--color-primary)",
      "var(--color-primary)",
      "var(--color-accent)",
      "var(--color-accent)"
    ],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: true
      },
      background: 'transparent'
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      bar: {
        barHeight: "50%",
        borderRadius: 10,
        horizontal: true,
        borderRadiusApplication: 'end',
        distributed: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: false,
      
    },
    legend: {
      show: false
    },
    grid: {
      show: true,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } }
    },
    xaxis: {
      categories: ['André', 'Maria', 'Ana', 'Felipe', 'João'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        show: false
      }
    },
    yaxis: {
      show: true,
      labels: { 
        show: true,
        style: {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      }
    },
    title: {
      text: 'Ranking de Presidentes',
      align: 'left',
      style: { fontSize: '18px', fontWeight: 'bold' }
    }
  };

  // ========== REFERÊNCIAS ==========
  const barChartRef = useRef(null);
  const donutRef = useRef(null);
  const rankingRef = useRef(null);
  const barChartInstance = useRef(null);
  const donutChartInstance = useRef(null);
  const rankingChartInstance = useRef(null);

  // ========== INICIALIZAR GRÁFICOS ==========
  useEffect(() => {
    if (barChartRef.current && !barChartInstance.current) {
      barChartInstance.current = new ApexCharts(barChartRef.current, barChartOptions);
      barChartInstance.current.render();
    }

    if (donutRef.current && !donutChartInstance.current) {
      donutChartInstance.current = new ApexCharts(donutRef.current, donutOptions);
      donutChartInstance.current.render();
    }

    if (rankingRef.current && !rankingChartInstance.current) {
      rankingChartInstance.current = new ApexCharts(rankingRef.current, rankingOptions);
      rankingChartInstance.current.render();
    }

    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
        barChartInstance.current = null;
      }
      if (donutChartInstance.current) {
        donutChartInstance.current.destroy();
        donutChartInstance.current = null;
      }
      if (rankingChartInstance.current) {
        rankingChartInstance.current.destroy();
        rankingChartInstance.current = null;
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
      }}><div>
          <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Painel Analítico</h2>
          <p style={{ margin: 0, color: '#666' }}>Ciclo 1 - Mês 6</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" style={{ padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Exportar <ExportIcon />
          </button>
          <button className="btn btn-primary" style={{ color: 'var(--white)', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Novo ciclo <AddIcon />
          </button>
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
          {/* Gráfico de Barras com ApexCharts */}
          <div className="card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '50px'
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: '600'
                }}
              >
                Participações por Mês
              </h3>

              <select
                style={{
                  padding: '10px 15px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#f3f3f3',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <option>Último ciclo</option>
                <option>Últimos 6 meses</option>
                <option>Último ano</option>
              </select>
            </div>
            <div ref={barChartRef}></div>
          </div>

          {/* Gráfico Donut */}
          <div className="card">
            <h3 style={{ marginBottom: '46px' }}>Distribuição por Perfil</h3>
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
            <div ref={rankingRef} style={{ overflowX: 'hidden' }}></div>
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
                <div style={{ background: '#e0e0e0', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
                  <div style={{
                    background: 'var(--color-primary)',
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