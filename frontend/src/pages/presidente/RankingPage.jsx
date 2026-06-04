import React from 'react';

function RankingPage() {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.headerTela}>
        <h1 style={styles.tituloTela}>Ranking de Presidentes</h1>
        <p style={styles.subtituloTela}>Gamificação da rede: Reconhecimento dos líderes com maior engajamento.</p>
      </div>

      <div style={styles.podiumContainer}>
        {/* 2º Lugar */}
        <div style={styles.podiumColunaContainer}>
          <div style={styles.podiumAvatar}>🥈</div>
          <div style={styles.podiumNome}>Joaquim Oliveira</div>
          <div style={styles.podiumComunidade}>Complexo do Alemão</div>
          <div style={styles.podiumPontos}>980 pts</div>
          <div style={{...styles.podiumBloco, height: '140px', background: '#cbd5e1'}}>
            <span style={styles.podiumNumero}>2</span>
          </div>
        </div>

        {/* 1º Lugar */}
        <div style={styles.podiumColunaContainer}>
          <div style={{...styles.podiumAvatar, fontSize: '50px'}}>👑</div>
          <div style={{...styles.podiumNome, fontWeight: '700'}}>Clara Santos</div>
          <div style={styles.podiumComunidade}>Rocinha</div>
          <div style={{...styles.podiumPontos, color: '#eab308'}}>1.250 pts</div>
          <div style={{...styles.podiumBloco, height: '190px', background: '#1e293b', borderTop: '6px solid #eab308'}}>
            <span style={{...styles.podiumNumero, color: '#eab308'}}>1</span>
          </div>
        </div>

        {/* 3º Lugar */}
        <div style={styles.podiumColunaContainer}>
          <div style={styles.podiumAvatar}>🥉</div>
          <div style={styles.podiumNome}>Bianca Lima</div>
          <div style={styles.podiumComunidade}>Vidigal</div>
          <div style={styles.podiumPontos}>890 pts</div>
          <div style={{...styles.podiumBloco, height: '100px', background: '#f59e0b', opacity: 0.8}}>
            <span style={styles.podiumNumero}>3</span>
          </div>
        </div>
      </div>

      <div style={styles.cardTabela}>
        <h3 style={styles.cardTituloSecundario}>Classificação Geral</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>Posição</th>
              <th style={styles.th}>Presidente</th>
              <th style={styles.th}>Comunidade</th>
              <th style={styles.th}>Visitas</th>
              <th style={styles.th}>Pontuação</th>
            </tr>
          </thead>
          <tbody>
            <tr style={styles.tableRow}>
              <td style={styles.td}>4º</td>
              <td style={styles.td}>Roberto Silva</td>
              <td style={styles.td}>Heliópolis</td>
              <td style={styles.td}>48</td>
              <td style={styles.td}>820 pts</td>
            </tr>
            <tr style={styles.tableRowActive}>
              <td style={{...styles.td, fontWeight: '700'}}>5º (Você)</td>
              <td style={{...styles.td, fontWeight: '700'}}>Usuário Demonstração</td>
              <td style={styles.td}>Comunidade Exemplo</td>
              <td style={styles.td}>45</td>
              <td style={{...styles.td, color: '#1e293b', fontWeight: '700'}}>780 pts</td>
            </tr>
            <tr style={styles.tableRow}>
              <td style={styles.td}>6º</td>
              <td style={styles.td}>Fernanda Costa</td>
              <td style={styles.td}>Paraisópolis</td>
              <td style={styles.td}>39</td>
              <td style={styles.td}>650 pts</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' },
  headerTela: { marginBottom: '32px' },
  tituloTela: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' },
  subtituloTela: { fontSize: '15px', color: '#64748b', margin: 0 },
  podiumContainer: { display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '24px', margin: '40px 0' },
  podiumColunaContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '160px' },
  podiumAvatar: { fontSize: '40px', marginBottom: '8px' },
  podiumNome: { fontSize: '15px', fontWeight: '600', color: '#1e293b', textAlign: 'center' },
  podiumComunidade: { fontSize: '12px', color: '#64748b', marginBottom: '8px' },
  podiumPontos: { fontSize: '16px', fontWeight: '700', color: '#475569', marginBottom: '12px' },
  podiumBloco: { width: '100%', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  podiumNumero: { fontSize: '28px', fontWeight: '700', color: '#ffffff' },
  cardTabela: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' },
  cardTituloSecundario: { fontSize: '18px', fontWeight: '700', color: '#1e293b', padding: '20px 20px 0 20px', margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeaderRow: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '14px 20px', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '15px', color: '#334155', borderBottom: '1px solid #f1f5f9' },
  tableRow: { backgroundColor: '#ffffff' },
  tableRowActive: { backgroundColor: '#f1f5f9' }
};

export default RankingPage;