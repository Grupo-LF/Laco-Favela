import React from 'react';
import '../../styles/pages/presidente/ProgressoCota.css';

function ProgressoCota({ visitasRealizadas = 18, meta = 24, diasRestantes = 20, posicaoRanking = 3 }) {
  const porcentagem = Math.round((visitasRealizadas / meta) * 100);
  const faltamParaMeta = meta - visitasRealizadas;
  const mesAtual = new Date().toLocaleString('pt-BR', { month: 'long' });

  return (
    <div className="progresso-cota">
      <div className="progresso-cota__header">
        <span className="progresso-cota__titulo">
          Progresso da Cota - {mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1)}
        </span>
        <span className="progresso-cota__porcentagem">{porcentagem}%</span>
      </div>
      <div className="progresso-cota__destaque">
        <span className="progresso-cota__numero">
          {visitasRealizadas}
          <span className="progresso-cota__total">/{meta}</span>
        </span>
        <span className="progresso-cota__label">visitas realizadas</span>
      </div>
      <div className="progresso-cota__barra-container">
        <div className="progresso-cota__barra" style={{ width: `${porcentagem}%` }} />
        <div className="progresso-cota__barra-limites">
          <span>0</span>
          <span>{meta}</span>
        </div>
      </div>
      <div className="progresso-cota__stats">
        <div className="progresso-cota__stat">
          <span className="progresso-cota__stat-label">Visitas realizadas</span>
          <span className="progresso-cota__stat-valor">{visitasRealizadas}</span>
        </div>
        <div className="progresso-cota__stat">
          <span className="progresso-cota__stat-label">Faltam para meta</span>
          <span className="progresso-cota__stat-valor">{faltamParaMeta}</span>
        </div>
        <div className="progresso-cota__stat">
          <span className="progresso-cota__stat-label">Dias restantes</span>
          <span className="progresso-cota__stat-valor">{diasRestantes}</span>
        </div>
        <div className="progresso-cota__stat">
          <span className="progresso-cota__stat-label">Posição no Ranking</span>
          <span className="progresso-cota__stat-valor">{posicaoRanking}º lugar</span>
        </div>
      </div>
    </div>
  );
}

export default ProgressoCota;