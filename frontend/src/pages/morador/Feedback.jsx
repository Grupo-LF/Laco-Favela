import React, { useState } from 'react';
import '../../styles/pages/morador/feedback.css';

// Ícones SVG fiéis ao Figma
const IconInfo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconElogio = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const IconSugestao = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-7 7c0 2.41 1.09 4.57 2.82 6H16.2a6.93 6.93 0 0 0 2.8-5.43A7 7 0 0 0 12 2z" />
  </svg>
);

const IconDenuncia = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default function Feedback() {
  const [feedbackType, setFeedbackType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackType || !message) {
      alert("Por favor, selecione o tipo de feedback e digite sua mensagem.");
      return;
    }
    // Lógica do Back-end permanece aqui...
    alert('Feedback enviado com sucesso!');
  };

  return (
    <div className="feedback-container">
      <header className="page-header">
        <h1>Feedback</h1>
        <p>Deixe um depoimento anônimo</p>
      </header>

      <div className="info-banner">
        <span className="info-icon"><IconInfo /></span>
        <p>Nenhum dado pessoal será associado ao seu feedback. Sua mensagem será enviada de forma completamente anônima e segura.</p>
      </div>

      <form onSubmit={handleSubmit} className="feedback-card">
        <div className="section-block">
          <h3>Tipo de Feedback:</h3>
          <div className="feedback-options">
            <button
              type="button"
              className={`option-btn ${feedbackType === 'Elogio' ? 'active' : ''}`}
              onClick={() => setFeedbackType('Elogio')}
            >
              <IconElogio /> Elogio
            </button>
            <button
              type="button"
              className={`option-btn ${feedbackType === 'Sugestão' ? 'active' : ''}`}
              onClick={() => setFeedbackType('Sugestão')}
            >
              <IconSugestao /> Sugestão
            </button>
            <button
              type="button"
              className={`option-btn ${feedbackType === 'Denúncia' ? 'active' : ''}`}
              onClick={() => setFeedbackType('Denúncia')}
            >
              <IconDenuncia /> Denúncia
            </button>
          </div>
        </div>

        <div className="message-box-container">
          <label>Sua mensagem</label>
          <span className="sub-label">DESCREVA AQUI</span>
          <textarea
            placeholder="Ex.: A entrega das doações poderia ser feita em outro horário."
            maxLength={500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <div className="char-count">{message.length}/500 caracteres</div>
          
          <button type="submit" className="submit-btn-blue">Enviar anonimamente</button>
        </div>
      </form>
    </div>
  );
}