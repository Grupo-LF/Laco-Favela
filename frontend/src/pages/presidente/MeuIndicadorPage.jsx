import React from 'react';

function MeuIndicadorPage() {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.headerTela}>
        <div>
          <h1 style={styles.tituloTela}>Meu Indicador</h1>
          <p style={styles.subtituloTela}>Acompanhamento do seu plano de metas e produtividade mensal.</p>
        </div>
        <div style={styles.badgePeriodo}>Período: Maio / 2026</div>
      </div>

      <div style={styles.gridCards}>
        {/* Card 1 */}
        <div style={styles.cardMetrica}>
          <div style={styles.cardHeaderMetrica}>
            <span style={styles.cardMetricaTitulo}>Visitas Realizadas</span>
            <span style={{...styles.cardMetricaIcon, background: '#e0f2fe', color: '#0369a1'}}>📍</span>
          </div>
          <div style={styles.cardMetricaValor}>48 <span style={styles.cardMetricaMeta}>/ 60</span></div>
          <div style={styles.progressBarBg}>
            <div style={{...styles.progressBarFill, width: '80%', background: '#0284c7'}}></div>
          </div>
          <span style={styles.cardMetricaSubtext}>80% da meta da comunidade atingida</span>
        </div>

        {/* Card 2 */}
        <div style={styles.cardMetrica}>
          <div style={styles.cardHeaderMetrica}>
            <span style={styles.cardMetricaTitulo}>Formulários Enviados</span>
            <span style={{...styles.cardMetricaIcon, background: '#dcfce7', color: '#15803d'}}>📝</span>
          </div>
          <div style={styles.cardMetricaValor}>48</div>
          <div style={{...styles.progressBarBg, height: '4px'}}>
            <div style={{...styles.progressBarFill, width: '100%', background: '#22c55e'}}></div>
          </div>
          <span style={styles.cardMetricaSubtext}>100% de consistência nos dados</span>
        </div>

        {/* Card 3 */}
        <div style={styles.cardMetrica}>
          <div style={styles.cardHeaderMetrica}>
            <span style={styles.cardMetricaTitulo}>Famílias Pendentes</span>
            <span style={{...styles.cardMetricaIcon, background: '#fef3c7', color: '#b45309'}}>🏠</span>
          </div>
          <div style={styles.cardMetricaValor}>12</div>
          <div style={{...styles.progressBarBg, height: '4px'}}>
            <div style={{...styles.progressBarFill, width: '20%', background: '#f59e0b'}}></div>
          </div>
          <span style={styles.cardMetricaSubtext}>Famílias aguardando visita no ciclo</span>
        </div>
      </div>

      <div style={styles.cardGrafico}>
        <h3 style={styles.cardTituloSecundario}>Progresso da Cota Mensal</h3>
        <div style={styles.containerGrafico}>
          <div style={{...styles.donutChart, background: 'conic-gradient(#1e293b 0% 80%, #e2e8f0 80% 100%)'}}>
            <div style={styles.donutCenter}>
              <span style={styles.donutPorcentagem}>80%</span>
              <span style={styles.donutLabel}>Concluído</span>
            </div>
          </div>
          <div style={styles.graficoLegendas}>
            <div style={styles.legendaItem}>
              <span style={{...styles.legendaCor, background: '#1e293b'}}></span>
              <div>
                <strong style={styles.legendaTitulo}>Realizado (48 famílias)</strong>
                <p style={styles.legendaDesc}>Visitas validadas e cadastradas no sistema.</p>
              </div>
            </div>
            <div style={styles.legendaItem}>
              <span style={{...styles.legendaCor, background: '#e2e8f0'}}></span>
              <div>
                <strong style={styles.legendaTitulo}>Restante (12 famílias)</strong>
                <p style={styles.legendaDesc}>Faltam 10 dias úteis para o encerramento do prazo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  progressBarFill: { height: '100%', borderRadius: '3px' },
  cardMetricaSubtext: { fontSize: '12px', color: '#94a3b8' },
  cardGrafico: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' },
  cardTituloSecundario: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px 0' },
  containerGrafico: { display: 'flex', alignItems: 'center', gap: '60px', padding: '20px 0', flexWrap: 'wrap' },
  donutChart: { width: '180px', height: '180px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
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