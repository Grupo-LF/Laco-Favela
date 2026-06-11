import React from 'react';
import '../../styles/pages/presidente/RankingPage.css';

export default function RankingPage() {
  return (
    <div className="pres-container">
      <header className="pres-header">
        <h1>Ranking</h1>
      </header>

      <div className="rank-main-layout">
        <div className="rank-left-column">
          {/* Pódio Visual */}
          <div className="rank-podium-card">
            <div className="podium-container">
              {/* 2º Lugar */}
              <div className="podium-column second">
                <div className="avatar-circle">AL</div>
                <span className="podium-name">Ana Lima</span>
                <div className="podium-bar bar-2">
                  <span className="position">2º</span>
                  <span className="points">91 pts</span>
                </div>
              </div>

              {/* 1º Lugar */}
              <div className="podium-column first">
                <div className="avatar-circle main-avatar">MC</div>
                <span className="podium-name">Maria Costa</span>
                <div className="podium-bar bar-1">
                  <span className="position">1º</span>
                  <span className="points">98 pts</span>
                </div>
              </div>

              {/* 3º Lugar */}
              <div className="podium-column third">
                <div className="avatar-circle">AA</div>
                <span className="podium-name">André Alves</span>
                <div className="podium-bar bar-3">
                  <span className="position">3º</span>
                  <span className="points">82 pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Classificação Geral */}
          <div className="rank-general-card">
            <h3>Classificação Geral</h3>
            <div className="rank-list">
              {[
                { pos: '1º', initial: 'MC', name: 'Maria Costa', sub: 'Rua do Sol • 30 famílias visitadas', pts: '98 pts' },
                { pos: '2º', initial: 'AL', name: 'Ana Lima', sub: 'Rua da Flor • 29 famílias visitadas', pts: '91 pts' },
                { pos: '3º', initial: 'AA', name: 'André Alves', sub: 'Rua da Planta • 28 famílias visitadas', pts: '82 pts' },
                { pos: '4º', initial: 'NS', name: 'Felipe Ramos', sub: 'Rua da Folha • 25 famílias visitadas', pts: '76 pts' },
                { pos: '5º', initial: 'NS', name: 'Rafael Coelho', sub: 'Rua da Árvore • 18 famílias visitadas', pts: '61 pts' }
              ].map((row, idx) => (
                <div key={idx} className="rank-list-item">
                  <div className="item-left-block">
                    <span className="list-pos">{row.pos}</span>
                    <div className="list-avatar">{row.initial}</div>
                    <div className="list-meta">
                      <span className="list-name">{row.name}</span>
                      <span className="list-sub">{row.sub}</span>
                    </div>
                  </div>
                  <span className="list-pts">{row.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rank-right-column">
          {/* Minha Pontuação */}
          <div className="rank-side-card">
            <h3>Minha Pontuação</h3>
            <div className="side-table">
              <div className="side-row">
                <span>Visitas realizadas</span>
                <span className="points-add">+36 pts</span>
              </div>
              <div className="side-row">
                <span>Formulários enviados</span>
                <span className="points-add">+36 pts</span>
              </div>
              <div className="side-row">
                <span>Cota atingida</span>
                <span className="points-add">+36 pts</span>
              </div>
              <div className="side-row">
                <span>Bônus pontualidade</span>
                <span className="points-add">+36 pts</span>
              </div>
              <div className="side-total-row">
                <span className="total-label">Total</span>
                <span className="total-value">82 pts</span>
              </div>
            </div>
          </div>

          {/* Como subir no Ranking */}
          <div className="rank-side-card info-card">
            <div className="card-header-with-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005691" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <h3>Como subir no Ranking</h3>
            </div>
            <div className="side-table plain">
              <div className="side-row">
                <span>Visita realizada</span>
                <span className="badge-pts">+2 pts</span>
              </div>
              <div className="side-row">
                <span>Formulário enviado</span>
                <span className="badge-pts">+3 pts</span>
              </div>
              <div className="side-row">
                <span>Cota 100% no mês</span>
                <span className="badge-pts">+10 pts</span>
              </div>
              <div className="side-row">
                <span>Envio em até 24h</span>
                <span className="badge-pts blue">+1 pt bônus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}