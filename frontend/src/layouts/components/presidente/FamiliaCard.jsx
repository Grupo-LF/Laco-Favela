import React from 'react';
import '../../styles/pages/presidente/FamiliaCard.css';

function FamiliaCard({ familia }) {
  return (
    <div className="familia-card">
      <div className="familia-card__info">
        <span className="familia-card__nome">{familia.nome}</span>
        <div className="familia-card__detalhe">
          <div className="familia-card__icone" />
          <span>{familia.endereco}</span>
        </div>
        <div className="familia-card__detalhe">
          <div className="familia-card__icone" />
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