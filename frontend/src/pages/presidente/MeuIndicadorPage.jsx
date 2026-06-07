import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MeuIndicadorPage() {
  // ========== ESTADOS ==========
  const [cota, setCota] = useState(null);
  const [ciclo, setCiclo] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========== CARREGAR DADOS DA API ==========
  useEffect(() => {
    async function carregarIndicadores() {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8000/api/presidentes/me/home/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });
        if (res.data) {
          setCota(res.data.cota);
          setCiclo(res.data.ciclo);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do indicador:', err);
      } finally {
        setLoading(false);
      }
    }
    carregarIndicadores();
  }, []);

  if (loading) {
    return <div style={{...styles.pageContainer, textAlign: 'center', paddingTop: '40px'}}>Carregando indicadores...</div>;
  }

  // ========== CÁLCULOS DINÂMICOS ==========
  const visitas = cota?.visitasRealizadas ?? 0;
  const meta = cota?.meta ?? 0;
  const pendentes = cota?.faltamParaMeta ?? 0;
  const diasRestantes = cota?.diasRestantes ?? 0;
  
  // Calcula o percentual de progresso de forma segura
  const percentual = meta > 0 ? Math.min(Math.round((visitas / meta) * 100), 100) : 0;
  const percentualPendentes = meta > 0 ? Math.min(Math.round((pendentes / meta) * 100), 100) : 0;

  // Renderização dinâmica do background do Donut Chart (CSS Conic Gradient)
  const donutGradient = `conic-gradient(#1e293b 0% ${percentual}%, #e2e8f0 ${percentual}% 100%)`;

  return (
    <div style={styles.pageContainer}>
      {/* HEADER DA TELA */}
      <div style={styles.headerTela}>
        <div>
          <h1 style={styles.tituloTela}>Meu Indicador</h1>
          <p style={styles.subtituloTela}>Acompanhamento do seu plano de metas e produtividade mensal.</p>
        </div>
        <div style={styles.badgePeriodo}>
          Período: {ciclo?.titulo || 'Ciclo Atual'}
        </div>
      </div>

      {/* GRID DE CARDS DE MÉTRICAS */}
      <div style={styles.gridCards}>
        {/* Card 1: Visitas Realizadas */}
        <div style={styles.cardMetrica}>
          <div style={styles.cardHeaderMetrica}>
            <span style={styles.cardMetricaTitulo}>Visitas Realizadas</span>
            <span style={{...styles.cardMetricaIcon, background: '#e0f2fe', color: '#0369a1'}}>📍</span>
          </div>
          <div style={styles.cardMetricaValor}>
            {visitas} <span style={styles.cardMetricaMeta}>/ {meta}</span>
          </div>
          <div style={styles.progressBarBg}>
            <div style={{...styles.progressBarFill, width: `${percentual}%`, background: '#0284c7'}}></div>
          </div>
          <span style={styles.cardMetricaSubtext}>{percentual}% da meta da comunidade atingida</span>
        </div>

        {/* Card 2: Formulários Enviados (Equivale às visitas com formulários enviados no ciclo) */}
        <div style={styles.cardMetrica}>
          <div style={styles.cardHeaderMetrica}>
            <span style={styles.cardMetricaTitulo}>Formulários Enviados</span>
            <span style={{...styles.cardMetricaIcon, background: '#dcfce7', color: '#15803d'}}>📝</span>
          </div>
          <div style={styles.cardMetricaValor}>{visitas}</div>
          <div style={{...styles.progressBarBg, height: '4px'}}>
            <div style={{...styles.progressBarFill, width: `${percentual}%`, background: '#22c55e'}}></div>
          </div>
          <span style={styles.cardMetricaSubtext}>Dados integrados ao ciclo ativo</span>
        </div>

        {/* Card 3: Famílias Pendentes */}
        <div style={styles.cardMetrica}>
          <div style={styles.cardHeaderMetrica}>
            <span style={styles.cardMetricaTitulo}>Famílias Pendentes</span>
            <span style={{...styles.cardMetricaIcon, background: '#fef3c7', color: '#b45309'}}>🏠</span>
          </div>
          <div style={styles.cardMetricaValor}>{pendentes}</div>
          <div style={{...styles.progressBarBg, height: '4px'}}>
            <div style={{...styles.progressBarFill, width: `${percentualPendentes}%`, background: '#f59e0b'}}></div>
          </div>
          <span style={styles.cardMetricaSubtext}>Famílias aguardando visita no ciclo</span>
        </div>
      </div>

      {/* SEÇÃO DO GRÁFICO DE ROSCA */}
      <div style={styles.cardGrafico}>
        <h3 style={styles.cardTituloSecundario}>Progresso da Cota Mensal</h3>
        <div style={styles.containerGrafico}>
          
          {/* Gráfico Donut customizado dinamicamente via Inline Style */}
          <div style={{...styles.donutChart, background: donutGradient}}>
            <div style={styles.donutCenter}>
              <span style={styles.donutPorcentagem}>{percentual}%</span>
              <span style={styles.donutLabel}>Concluído</span>
            </div>
          </div>

          {/* Legendas do Gráfico */}
          <div style={styles.graficoLegendas}>
            <div style={styles.legendaItem}>
              <span style={{...styles.legendaCor, background: '#1e293b'}}></span>
              <div>
                <strong style={styles.legendaTitulo}>Realizado ({visitas} famílias)</strong>
                <p style={styles.legendaDesc}>Visitas validadas e cadastradas no sistema.</p>
              </div>
            </div>
            <div style={styles.legendaItem}>
              <span style={{...styles.legendaCor, background: '#e2e8f0'}}></span>
              <div>
                <strong style={styles.legendaTitulo}>Restante ({pendentes} famílias)</strong>
                <p style={styles.legendaDesc}>Restam apenas {diasRestantes} dias para o encerramento do prazo.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Mapeamento de estilos em formato CSS-in-JS (Mantido o padrão original)
const styles = {
  pageContainer: { padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' },
  headerTela: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  tituloTela: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' },
  subtituloTela: { fontSize: '15px', color: '#64748b', margin: 0 },
  badgePeriodo: { backgroundColor: '#e2e8f0', color: '#334155', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' },
  gridCards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' },
  cardMetrica: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' },
  cardHeaderMetrica: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  cardMetricaTitulo: { fontSize: '14px', fontWeight: '600', color: '#64748b' },
  cardMetricaIcon: { width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
  cardMetricaValor: { fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' },
  cardMetricaMeta: { fontSize: '16px', color: '#94a3b8', fontWeight: '400' },
  progressBarBg: { width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' },
  progressBarFill: { height: '100%', borderRadius: '3px', transition: 'width 0.4s ease' }, // Adicionada uma leve transição visual
  cardMetricaSubtext: { fontSize: '12px', color: '#94a3b8' },
  cardGrafico: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' },
  cardTituloSecundario: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px 0' },
  containerGrafico: { display: 'flex', alignItems: 'center', gap: '60px', padding: '20px 0', flexWrap: 'wrap' },
  donutChart: { width: '180px', height: '180px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s ease' },
  donutCenter: { width: '130px', height: '130px', backgroundColor: '#ffffff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  donutPorcentagem: { fontSize: '28px', fontWeight: '700', color: '#1e293b' },
  donutLabel: { fontSize: '12px', color: '#64748b', fontWeight: '500' },
  graficoLegendas: { display: 'flex', flexDirection: 'column', gap: '16px' },
  legendaItem: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  legendaCor: { width: '12px', height: '12px', borderRadius: '3px', marginTop: '4px' },
  legendaTitulo: { fontSize: '15px', fontWeight: '600', color: '#334155' },
  legendaDesc: { fontSize: '13px', color: '#64748b', margin: 0 }
};

export default MeuIndicadorPage;