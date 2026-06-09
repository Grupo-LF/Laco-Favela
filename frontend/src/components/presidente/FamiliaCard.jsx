import React from 'react';
import '../../styles/pages/presidente/FamiliaCard.css';

const IconLocalizacao = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconMembros = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

function FamiliaCard({ familia }) {
  return (
    <div className="familia-card">
      <div className="familia-card__info">
        <span className="familia-card__nome">{familia.nome}</span>
        <div className="familia-card__detalhe">
          <span className="familia-card__icone"><IconLocalizacao /></span>
          <span>{familia.endereco}</span>
        </div>
        <div className="familia-card__detalhe">
          <span className="familia-card__icone"><IconMembros /></span>
          <span>{familia.membros} membros</span>
        </div>
      </div>
      <div className="familia-card__tags">
        <span className={`familia-card__status familia-card__status--${familia.status?.toLowerCase()}`}>
          {familia.status}
        </span>
        {familia.perfil && (
          <span className="familia-card__perfil">{familia.perfil}</span>
        )}
      </div>
    </div>
  );
}

export default FamiliaCard;