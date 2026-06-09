import React, { useState } from 'react';
import '../../styles/pages/morador/ser_presidente.css';

// Ícones SVG fiéis ao Figma
const IconBannerComunidade = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function SerPresidente() {
  const [motivation, setMotivation] = useState('');

  return (
    <div className="presidente-container">
      <header className="page-header">
        <h1>Ser Presidente</h1>
      </header>

      <div className="leader-banner">
        <div className="banner-icon-home"><IconBannerComunidade /></div>
        <div className="banner-text">
          <h2>Seja um Líder Comunitário!</h2>
          <p>Represente sua comunidade e ajude a transformar o Laço Favela. Sua candidatura é avaliada pela equipe e pela própria comunidade.</p>
        </div>
      </div>

      <div className="info-columns-grid">
        <div className="info-card">
          <h3>Requisitos</h3>
          <ul className="requirements-list">
            <li><IconCheck /> Ser morador cadastrado há pelo menos 6 meses</li>
            <li><IconCheck /> Nível de engajamento mínimo: Nível 2</li>
            <li><IconCheck /> Não ter pendências no sistema</li>
            <li><IconCheck /> Comprometer-se com reuniões mensais obrigatórias</li>
          </ul>
          <div className="validation-pill">
            <span className="pill-check"><IconCheck /></span> Você cumpre todos os requisitos!
          </div>
        </div>

        <div className="info-card">
          <h3>Dados da Inscrição</h3>
          <table className="dados-tabela">
            <tbody>
              <tr>
                <td>Nome</td>
                <td className="bold-text">Pedro Pereira dos Santos</td>
              </tr>
              <tr>
                <td>Comunidade</td>
                <td className="bold-text">Fitinha - Setor C</td>
              </tr>
              <tr>
                <td>Nível</td>
                <td className="bold-text">Nível 3 - Engajado</td>
              </tr>
              <tr>
                <td>Tempo na comunidade</td>
                <td className="bold-text">2 anos e 4 meses</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <form className="motivation-card">
        <h3>Por que você quer ser presidente?</h3>
        <label>Sua motivação</label>
        <textarea
          placeholder="Conte sua motivação, planos e o que melhorar na comunidade."
          maxLength={500}
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
        ></textarea>
        <div className="char-count">{motivation.length}/500 caracteres</div>
        
        <button type="submit" className="submit-btn-blue">Enviar candidatura</button>
      </form>
    </div>
  );
}