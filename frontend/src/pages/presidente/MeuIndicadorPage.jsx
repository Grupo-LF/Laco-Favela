import React from 'react';
import '../../styles/pages/presidente/MeuIndicadorPage.css';

const IconMetaCota = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005691" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconMetaForm = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005691" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconMetaStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005691" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function MeuIndicadorPage() {
  return (
    <div className="pres-container">
      <header className="pres-header">
        <h1>Meu Indicador</h1>
        <p>Verifique o nível do seu progresso</p>
      </header>

      <div className="pres-grid-2x2">
        {/* Card 1: Cotas de visitas */}
        <div className="pres-card">
          <h3>Cotas de visitas - Maio 2026</h3>
          <div className="pres-donut-wrapper">
            <div className="pres-donut-chart">
              {/* Gráfico Donut em SVG perfeitamente calculado para 75% */}
              <svg width="140" height="140" viewBox="0 0 40 40" className="donut">
                <circle className="donut-hole" cx="20" cy="20" r="15.915" fill="transparent"></circle>
                <circle className="donut-ring" cx="20" cy="20" r="15.915" fill="transparent" stroke="#EFEFEF" strokeWidth="3.5"></circle>
                <circle className="donut-segment" cx="20" cy="20" r="15.915" fill="transparent" stroke="#005691" strokeWidth="3.5" strokeDasharray="75 25" strokeDashoffset="25"></circle>
              </svg>
              <div className="pres-donut-text">
                <span className="percentage">75%</span>
                <span className="fraction">18/24</span>
              </div>
            </div>
          </div>
          <div className="pres-donut-footer">
            <p className="footer-main">6 visitas para completar a cota</p>
            <p className="footer-sub">20 dias restantes em maio</p>
          </div>
        </div>

        {/* Card 2: Metas e Recompensas */}
        <div className="pres-card">
          <h3>Metas e Recompensas</h3>
          <div className="pres-rewards-list">
            <div className="reward-item">
              <div className="reward-icon"><IconMetaCota /></div>
              <div className="reward-info">
                <h4>Atingir 100% da cota</h4>
                <p>+10 pontos de ranking • Destaque regional</p>
              </div>
            </div>
            <div className="reward-item">
              <div className="reward-icon"><IconMetaForm /></div>
              <div className="reward-info">
                <h4>Enviar todos os formulários</h4>
                <p>+5 pontos de ranking • Prioridade em Doações</p>
              </div>
            </div>
            <div className="reward-item">
              <div className="reward-icon"><IconMetaStar /></div>
              <div className="reward-info">
                <h4>3 meses seguidos 100%</h4>
                <p>Reconhecimento na reunião geral</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Histórico de cotas */}
        <div className="pres-card">
          <h3>Histórico de cotas</h3>
          <div className="pres-history-list">
            {[
              { label: 'Maio 2026', value: 75 },
              { label: 'Abril 2026', value: 100 },
              { label: 'Março 2026', value: 96 },
              { label: 'Fevereiro 2026', value: 83 },
              { label: 'Janeiro 2026', value: 91 }
            ].map((item, idx) => (
              <div key={idx} className="history-row">
                <div className="history-label-line">
                  <span>{item.label}</span>
                  <span className="history-val">{item.value}%</span>
                </div>
                <div className="history-progress-bg">
                  <div className="history-progress-fill" style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Desempenho Mensal */}
        <div className="pres-card">
          <h3>Desempenho Mensal</h3>
          <div className="pres-table-rows">
            <div className="table-row">
              <span className="row-label">Metas de visitas (maio)</span>
              <span className="row-value bold">24</span>
            </div>
            <div className="table-row">
              <span className="row-label">Visitas realizadas</span>
              <span className="row-value bold">18</span>
            </div>
            <div className="table-row">
              <span className="row-label">Famílias sem visita</span>
              <span className="row-value bold highlight">6</span>
            </div>
            <div className="table-row">
              <span className="row-label">Formulários enviados</span>
              <span className="row-value bold">12</span>
            </div>
            <div className="table-row">
              <span className="row-label">Taxa de cobertura</span>
              <span className="row-value bold blue-text">75%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}